import { MySql2Database } from 'drizzle-orm/mysql2';
import { transactions } from '../../db/schema.js';
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
} from './occurrence.schema.js';

export class TransactionService {
    private db: MySql2Database;

    constructor(db: MySql2Database) {
        this.db = db;
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

        const txns = await this.db
            .select()
            .from(transactions)
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
            )
            .then((rs) => rs.map(transactionFromDb));

        const occurrences = txns.flatMap((txn) =>
            getTransactionOccurrences(txn, opts.from, opts.to),
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

    async create(txn: TransactionCreate, userId: number): Promise<void> {
        await this.db
            .insert(transactions)
            .values({
                ...txn,
                date: txn.date.toJSDate(),
                userId,
                id: undefined,
                recurrence: txn.recurrence
                    ? recurrenceToDb(txn.recurrence)
                    : null,
                recurrenceEndsAt: txn.recurrence?.endsAt?.toJSDate(),
            })
            .execute();
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
        description: raw.description ?? '',
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

    const { id, ...rest } = txn;

    return dates.map((date) => ({
        ...rest,
        date,
        transactionId: id,
    }));
}
