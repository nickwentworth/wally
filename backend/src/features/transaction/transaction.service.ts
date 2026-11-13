import { MySql2Database } from 'drizzle-orm/mysql2';
import { exceptions, transactions } from '../../db/schema.js';
import {
    and,
    eq,
    gte,
    inArray,
    isNotNull,
    isNull,
    like,
    lte,
    or,
} from 'drizzle-orm';
import { DateTime } from 'luxon';
import {
    extrapolateRecurrence,
    Recurrence,
    recurrenceFromDb,
    recurrenceToDb,
} from './recurrence.js';
import {
    OccurrenceList,
    OccurrencePage,
    OccurrenceUpdate,
    RecurringTransactionUpdate,
    RecurringTransaction,
    TransactionCreate,
    Occurrence,
} from './transaction.schema.js';
import { OmitStrict } from '../../util/types.js';

export class TransactionService {
    private db: MySql2Database;

    constructor(db: MySql2Database) {
        this.db = db;
    }

    /* ———————————————————— Transactions ———————————————————— */

    private async getTransactionById(
        id: number,
        userId: number,
    ): Promise<Transaction | null> {
        return await this.db
            .select()
            .from(transactions)
            .where(
                and(eq(transactions.id, id), eq(transactions.userId, userId)),
            )
            .then((rs) => (rs.length > 0 ? transactionFromDb(rs[0]) : null));
    }

    async createTransaction(
        create: TransactionCreate,
        userId: number,
    ): Promise<number> {
        return await this.db
            .insert(transactions)
            .values({
                userId,
                amount: create.amount,
                categoryId: create.categoryId,
                date: create.date.toJSDate(),
                description: create.description,
                recurrence: create.recurrence
                    ? recurrenceToDb(create.recurrence)
                    : null,
                recurrenceEndsAt: create.recurrence?.endsAt?.toJSDate(),
            })
            .$returningId()
            .then((rs) => rs[0].id);
    }

    /* ———————————————————— Recurring ———————————————————— */

    async getAllRecurringTransactions(
        userId: number,
    ): Promise<RecurringTransaction[]> {
        return await this.db
            .select()
            .from(transactions)
            .where(
                and(
                    eq(transactions.userId, userId),
                    isNotNull(transactions.recurrence),
                    isNull(transactions.recurrenceNextId),
                ),
            )
            .then((rs) => rs.map(transactionFromDb))
            .then((txns) => txns.map(toRecurringTransaction));
    }

    async updateRecurringTransaction(
        update: RecurringTransactionUpdate,
        userId: number,
    ): Promise<void> {
        const existing = await this.getTransactionById(update.id, userId);

        if (!existing || !existing.recurrence) {
            // Nothing to do, no such transaction exists
            return;
        }

        // TODO: start new transaction today or tomorrow?
        const clipExistingAt = DateTime.now();

        // Create the new recurring transaction, directly 1 day after
        const nextId = await this.createTransaction(
            {
                date: clipExistingAt.plus({ days: 1 }),
                amount: update.amount ?? existing.amount,
                categoryId:
                    update.categoryId !== undefined
                        ? update.categoryId
                        : existing.categoryId,
                description: update.description ?? existing.description,
                recurrence: update.recurrence ?? existing.recurrence,
            },
            existing.userId,
        );

        // And clip existing recurring transaction today
        await this.db
            .update(transactions)
            .set({
                recurrenceEndsAt: clipExistingAt.toJSDate(),
                recurrenceNextId: nextId,
            })
            .where(eq(transactions.id, existing.id));

        // TODO: decide how to handle future exceptions, if those are even allowed?
    }

    /* ———————————————————— Occurrences ———————————————————— */

    async listOccurrences(
        opts: OccurrenceList,
        userId: number,
    ): Promise<OccurrencePage> {
        const rows = await this.db
            .select({
                transaction: transactions,
                exception: exceptions,
            })
            .from(transactions)
            .leftJoin(exceptions, eq(transactions.id, exceptions.masterId))
            .where(
                and(
                    eq(transactions.userId, userId),
                    // Ensure all transactions don't exist after the time range ends
                    lte(transactions.date, opts.to.toJSDate()),
                    // Ensure recurring transactions don't end before the time range starts
                    or(
                        isNull(transactions.recurrenceEndsAt),
                        gte(
                            transactions.recurrenceEndsAt,
                            opts.from.toJSDate(),
                        ),
                    ),
                    // Ensure non-recurring transactions don't exist before the time range starts
                    or(
                        isNotNull(transactions.recurrence),
                        gte(transactions.date, opts.from.toJSDate()),
                    ),
                    // Filters
                    opts.categoryIds?.length
                        ? inArray(transactions.categoryId, opts.categoryIds)
                        : undefined,
                    opts.search
                        ? like(transactions.description, `%${opts.search}%`)
                        : undefined,
                ),
            );

        // Classify into txn -> exceptions map (or equivalent)
        type TxnExcEntry = {
            txn: Transaction;
            excs: DateTime[];
        };
        const entries = new Map<number, TxnExcEntry>();

        rows.forEach((row) => {
            const transaction = transactionFromDb(row.transaction);

            if (!entries.has(transaction.id)) {
                entries.set(transaction.id, { txn: transaction, excs: [] });
            }

            if (row.exception) {
                const date = DateTime.fromJSDate(row.exception.date);
                entries.get(transaction.id)!.excs.push(date);
            }
        });

        // Expand into a list of occurrences (not considering exceptions)
        const occurrences = Array.from(entries.values()).flatMap<Occurrence>(
            (entry) => {
                const { txn, excs } = entry;

                if (!txn.recurrence) {
                    return [
                        {
                            id: txn.id,
                            amount: txn.amount,
                            categoryId: txn.categoryId,
                            date: txn.date,
                            description: txn.description,
                            recurringTransactionId: null,
                        },
                    ];
                }

                const dates = extrapolateRecurrence(
                    txn.recurrence,
                    txn.date,
                    opts.from,
                    opts.to,
                ).filter((date) => !excs.some((exc) => exc.equals(date))); // filter exceptions out

                return dates.map<Occurrence>((date) => ({
                    id: txn.id,
                    amount: txn.amount,
                    categoryId: txn.categoryId,
                    date,
                    description: txn.description,
                    recurringTransactionId: txn.id,
                }));
            },
        );

        occurrences.sort(
            (a, b) => b.date.toUnixInteger() - a.date.toUnixInteger(),
        );

        let net = 0,
            income = 0,
            expenses = 0;
        occurrences.forEach((occ) => {
            net += occ.amount;
            if (occ.amount > 0) {
                income += occ.amount;
            } else {
                expenses += occ.amount;
            }
        });

        return {
            occurrences: occurrences.slice(
                opts.offset,
                opts.offset + opts.limit,
            ),
            totals: { net, income, expenses },
            count: occurrences.length,
        };
    }

    async updateOccurrence(
        update: OccurrenceUpdate,
        userId: number,
    ): Promise<void> {
        const master = await this.getTransactionById(update.id, userId);

        if (!master) {
            // Nothing to do, no such transaction exists
            return;
        } else if (!master.recurrence) {
            // One-off occurrences can just update the transaction row directly
            await this.db
                .update(transactions)
                .set({
                    amount: update.amount,
                    categoryId: update.categoryId,
                    date: update.date?.toJSDate(),
                    description: update.description,
                })
                .where(
                    and(
                        eq(transactions.id, update.id),
                        eq(transactions.userId, userId),
                    ),
                );
        } else {
            // Create a new exception of the original recurring transaction

            // TODO: Would be best to use a DB transaction
            const exceptionId = await this.createTransaction(
                {
                    date: update.date ?? update.occursOn,
                    amount: update.amount ?? master.amount,
                    categoryId:
                        // Specifically check undefined, since null is a valid option
                        update.categoryId !== undefined
                            ? update.categoryId
                            : master.categoryId,
                    description: update.description ?? master.description,
                    recurrence: null,
                },
                userId,
            );

            await this.db.insert(exceptions).values({
                masterId: master.id,
                exceptionId,
                date: update.occursOn.toJSDate(),
            });
        }
    }
}

type TransactionDb = typeof transactions.$inferSelect;

type Transaction = OmitStrict<
    TransactionDb,
    'date' | 'recurrence' | 'recurrenceEndsAt'
> & {
    date: DateTime;
    recurrence: Recurrence | null;
};

function transactionFromDb(t: TransactionDb): Transaction {
    const recurrence = t.recurrence
        ? recurrenceFromDb(t.recurrence, t.recurrenceEndsAt ?? undefined)
        : null;

    return {
        id: t.id,
        amount: t.amount,
        categoryId: t.categoryId,
        date: DateTime.fromJSDate(t.date),
        description: t.description,
        recurrence,
        recurrenceNextId: t.recurrenceNextId,
        userId: t.userId,
    };
}

function toRecurringTransaction(t: Transaction): RecurringTransaction {
    if (!t.recurrence) {
        throw new Error('Provided transction is not recurring');
    }

    return {
        id: t.id,
        startsAt: t.date,
        amount: t.amount,
        categoryId: t.categoryId,
        description: t.description,
        recurrence: t.recurrence,
    };
}
