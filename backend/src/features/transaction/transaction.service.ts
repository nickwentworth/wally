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
    TransactionList,
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

    async getById(id: number, userId: number): Promise<Transaction | null> {
        return await this.db
            .select()
            .from(transactions)
            .where(
                and(eq(transactions.id, id), eq(transactions.userId, userId)),
            )
            .then((rs) => (rs.length > 0 ? transactionFromDb(rs[0]) : null));
    }

    async list(opts: TransactionList, userId: number): Promise<Transaction[]> {
        const txns = await this.db
            .select()
            .from(transactions)
            .where(
                and(
                    eq(transactions.userId, userId),
                    opts.recurringOnly
                        ? isNotNull(transactions.recurrence)
                        : undefined,
                ),
            )
            .then((rs) => rs.map(transactionFromDb));

        return txns;
    }

    // TODO: maybe should be in its own service later on
    async listOccurrences(
        opts: OccurrenceList,
        userId: number,
    ): Promise<OccurrencePage> {
        // Drizzle wants js dates, so pre-process
        const fromDate = opts.from.toJSDate();
        const toDate = opts.to.toJSDate();

        const txnRows = await this.db
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
                    lte(transactions.date, toDate),
                    // Ensure recurring transactions don't end before the time range starts
                    or(
                        isNull(transactions.recurrenceEndsAt),
                        gte(transactions.recurrenceEndsAt, fromDate),
                    ),
                    // Ensure non-recurring transactions don't exist before the time range starts
                    or(
                        isNotNull(transactions.recurrence),
                        gte(transactions.date, fromDate),
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

        txnRows.forEach((row) => {
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
        const txn = await this.getById(occ.transaction.id, userId);
        if (!txn) {
            throw new Error('Transaction not found');
        }

        if (!txn.recurrence) {
            // This is a simple one-off transaction, or already an exception
            await this.update(occ.transaction, userId);
            return;
        }

        // TODO: Would be best to use a DB transaction below

        const exceptionId = await this.create(
            {
                amount: occ.transaction.amount ?? txn.amount,
                categoryId:
                    // Specifically check undefined, since null is a valid option
                    occ.transaction.categoryId !== undefined
                        ? occ.transaction.categoryId
                        : txn.categoryId,
                date: occ.transaction.date ?? occ.date,
                description: occ.transaction.description ?? txn.description,
                recurrence: null,
            },
            userId,
        );

        await this.createException(txn.id, exceptionId, occ.date);
    }

    async create(txn: TransactionCreate, userId: number): Promise<number> {
        return await this.db
            .insert(transactions)
            .values({
                userId,
                amount: txn.amount,
                categoryId: txn.categoryId,
                date: txn.date.toJSDate(),
                description: txn.description,
                recurrence: txn.recurrence
                    ? recurrenceToDb(txn.recurrence)
                    : null,
                recurrenceEndsAt: txn.recurrence?.endsAt?.toJSDate(),
            })
            .$returningId()
            .then((rs) => rs[0].id);
    }

    async update(txn: TransactionUpdate, userId: number): Promise<void> {
        await this.db
            .update(transactions)
            .set({
                amount: txn.amount,
                categoryId: txn.categoryId,
                date: txn.date?.toJSDate(),
                description: txn.description,
            })
            .where(
                and(
                    eq(transactions.id, txn.id),
                    eq(transactions.userId, userId),
                ),
            );
    }

    async createException(
        masterId: number,
        exceptionId: number,
        exceptionDate: DateTime,
    ): Promise<void> {
        await this.db.insert(exceptions).values({
            masterId,
            exceptionId,
            date: exceptionDate.toJSDate(),
        });
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
