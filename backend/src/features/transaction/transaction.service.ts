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
    recurrenceFromDb,
    recurrenceToDb,
} from './recurrence.js';
import {
    Transaction,
    TransactionCreate,
    TransactionUpdate,
} from './transaction.schema.js';
import {
    OccurrencePage,
    Occurrence,
    OccurrenceList,
    OccurrenceUpdate,
} from './occurrence.schema.js';

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

    async getAllRecurringTransactions(userId: number): Promise<Transaction[]> {
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
            .then((rs) => rs.map(transactionFromDb));
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

    async updateTransaction(
        update: TransactionUpdate,
        userId: number,
    ): Promise<void> {
        const existing = await this.getTransactionById(update.id, userId);

        if (!existing) {
            // Nothing to do, no such transaction exists
            return;
        } else if (!existing.recurrence) {
            // Safe to edit a non-recurring transaction directly
            await this.db
                .update(transactions)
                .set({
                    amount: update.amount,
                    categoryId: update.categoryId,
                    date: update.date?.toJSDate(),
                    description: update.description,
                })
                .where(eq(transactions.id, existing.id));
        } else {
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
    }

    /* ———————————————————— Occurrences ———————————————————— */

    // TODO: maybe should be in its own service later on
    async listOccurrences(
        opts: OccurrenceList,
        userId: number,
    ): Promise<OccurrencePage> {
        const rs = await this.db
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

        const txns = new Map<
            number,
            { transaction: Transaction; exceptionDates: DateTime[] }
        >();

        rs.forEach((row) => {
            const { transaction, exception } = row;

            if (!txns.has(transaction.id)) {
                txns.set(transaction.id, {
                    transaction: transactionFromDb(transaction),
                    exceptionDates: [],
                });
            }

            if (exception) {
                const date = DateTime.fromJSDate(exception.date);
                txns.get(transaction.id)?.exceptionDates.push(date);
            }
        });

        const occurrences = Array.from(txns.values()).flatMap((value) => {
            const { transaction, exceptionDates } = value;

            return getTransactionOccurrences(
                transaction,
                opts.from,
                opts.to,
            ).filter(
                (occ) => !exceptionDates.some((exc) => exc.equals(occ.date)),
            );
        });

        occurrences.sort(
            (a, b) => b.date.toUnixInteger() - a.date.toUnixInteger(),
        );

        let net = 0,
            income = 0,
            expenses = 0;
        occurrences.forEach((occ) => {
            net += occ.transaction.amount;
            if (occ.transaction.amount > 0) {
                income += occ.transaction.amount;
            } else {
                expenses += occ.transaction.amount;
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
        occ: OccurrenceUpdate,
        userId: number,
    ): Promise<void> {
        const master = await this.getTransactionById(
            occ.transaction.id,
            userId,
        );
        const update = occ.transaction;

        if (!master || master.userId !== userId) {
            throw new Error('Transaction not found');
        } else if (!master.recurrence) {
            // One-off occurrences treated same as editing non-recurring transaction
            await this.updateTransaction(occ.transaction, userId);
        } else {
            // Create a new exception of the original recurring transaction

            // TODO: Would be best to use a DB transaction
            const exceptionId = await this.createTransaction(
                {
                    date: update.date ?? occ.date,
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
                date: occ.date.toJSDate(),
            });
        }
    }
}

type TransactionSelect = typeof transactions.$inferSelect;

function transactionFromDb(raw: TransactionSelect): Transaction {
    const recurrence = raw.recurrence
        ? recurrenceFromDb(raw.recurrence, raw.recurrenceEndsAt ?? undefined)
        : null;

    return {
        id: raw.id,
        amount: raw.amount,
        categoryId: raw.categoryId,
        date: DateTime.fromJSDate(raw.date),
        description: raw.description,
        recurrence,
        userId: raw.userId,
    };
}

function getTransactionOccurrences(
    txn: Transaction,
    from: DateTime,
    to: DateTime,
): Occurrence[] {
    const dates = txn.recurrence
        ? extrapolateRecurrence(txn.recurrence, txn.date, from, to)
        : [txn.date];

    return dates.map((date) => ({
        date,
        transaction: txn,
    }));
}
