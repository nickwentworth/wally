import { MySql2Database } from 'drizzle-orm/mysql2';
import { transactions } from '../db/schema.js';
import z from 'zod';
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
import { LuxonDateTime } from '../util/types.js';
import {
    deserializeRecurrence,
    extrapolateRecurrence,
    Recurrence,
    serializeRecurrence,
} from './recurrence.js';

// -------------------- Schemas/Types -------------------- //

export const TransactionList = z.object({
    recurringOnly: z.boolean().default(false),
});
type TransactionList = z.infer<typeof TransactionList>;

export const OccurrenceList = z.object({
    from: LuxonDateTime,
    to: LuxonDateTime,
    categoryIds: z.number().array().optional(),
    search: z.string().optional(),
    offset: z.int().min(0).default(0),
    limit: z.int().min(1).max(100).default(50),
});
type OccurrenceList = z.infer<typeof OccurrenceList>;

export const TransactionCreate = z.object({
    amount: z.number(),
    categoryId: z.int().optional(),
    date: LuxonDateTime,
    description: z.string().optional(),
    recurrence: Recurrence.optional(),
});
type TransactionCreate = z.infer<typeof TransactionCreate>;

export const TransactionUpdate = z.object({
    id: z.int(),
    amount: z.number().optional(),
    categoryId: z.int().nullable().optional(),
    date: LuxonDateTime.optional(),
    description: z.string().optional(),
});
type TransactionUpdate = z.infer<typeof TransactionUpdate>;

type Transaction = ReturnType<typeof deserializeTransaction>;

// -------------------- Service -------------------- //

export class TransactionService {
    private db: MySql2Database;

    constructor(db: MySql2Database) {
        this.db = db;
    }

    async list(opts: TransactionList, userId: number) {
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
            .then((rs) => rs.map(deserializeTransaction));

        return txns;
    }

    // TODO: maybe should be in its own service later on
    async listOccurrences(opts: OccurrenceList, userId: number) {
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
            .then((rs) => rs.map(deserializeTransaction));

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

    async create(txn: TransactionCreate, userId: number) {
        await this.db
            .insert(transactions)
            .values({
                ...txn,
                date: txn.date.toJSDate(),
                userId,
                id: undefined,
                recurrence: txn.recurrence
                    ? serializeRecurrence(txn.recurrence)
                    : null,
                recurrenceEndsAt: txn.recurrence?.endsAt?.toJSDate(),
            })
            .execute();
    }

    async update(txn: TransactionUpdate, userId: number) {
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

function deserializeTransaction(raw: typeof transactions.$inferSelect) {
    const { date, recurrence, recurrenceEndsAt, ...rest } = raw;

    const r = recurrence
        ? deserializeRecurrence(recurrence, recurrenceEndsAt ?? undefined)
        : null;

    return {
        ...rest,
        date: DateTime.fromJSDate(date),
        recurrence: r,
    };
}

function getTransactionOccurrences(
    txn: Transaction,
    from: DateTime,
    to: DateTime,
) {
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
