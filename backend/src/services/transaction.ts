import { MySql2Database } from 'drizzle-orm/mysql2';
import { transactions } from '../db/schema.js';
import z from 'zod';
import { and, eq, gte, isNotNull, isNull, lte, or } from 'drizzle-orm';
import { DateTime } from 'luxon';
import { LuxonDateTime } from '../util/types.js';

// -------------------- Schemas/Types -------------------- //

export const TxnGet = z.object({
    // limit: z.number(),
    start: LuxonDateTime,
    end: LuxonDateTime,
    // categoryIds: z.number().array().optional(),
    // search: z.string().optional(),
});
type TxnGet = z.infer<typeof TxnGet>;

const TxnRecurrenceBase = z.object({
    rate: z.number(),
    endsAt: LuxonDateTime.optional(),
});
type TxnRecurrenceBase = z.infer<typeof TxnRecurrenceBase>;

const TxnRecurrence = z.discriminatedUnion('period', [
    TxnRecurrenceBase.extend({
        period: z.literal('daily'),
    }),
    TxnRecurrenceBase.extend({
        period: z.literal('weekly'),
        daysOfWeek: z.int().min(0).max(6).array().nonempty(),
    }),
    TxnRecurrenceBase.extend({
        period: z.literal('monthly'),
        daysOfMonth: z.int().min(1).max(31).array().nonempty(),
    }),
    TxnRecurrenceBase.extend({
        period: z.literal('yearly'),
        daysOfYear: z.int().min(1).max(366).array().nonempty(),
    }),
]);
type TxnRecurrence = z.infer<typeof TxnRecurrence>;

export const TxnCreate = z.object({
    amount: z.number(),
    categoryId: z.int().optional(),
    date: LuxonDateTime,
    description: z.string().optional(),
    recurrence: TxnRecurrence.optional(),
});
type TxnCreate = z.infer<typeof TxnCreate>;

type TxnSelectRaw = typeof transactions.$inferSelect;

// -------------------- Service -------------------- //

export class TransactionService {
    private db: MySql2Database;

    constructor(db: MySql2Database) {
        this.db = db;
    }

    async getTransactions(opts: TxnGet, userId: number) {
        // Drizzle wants js dates, so pre-process
        const start = opts.start.toJSDate();
        const end = opts.end.toJSDate();

        const txns = await this.db
            .select()
            .from(transactions)
            .where(
                and(
                    eq(transactions.userId, userId),
                    // Ensure all transactions don't exist after the time range ends
                    lte(transactions.date, end),
                    // Ensure recurring transactions don't end before the time range starts
                    or(
                        isNull(transactions.recurrenceEndsAt),
                        gte(transactions.recurrenceEndsAt, start),
                    ),
                    // Ensure non-recurring transactions don't exist before the time range starts
                    or(
                        isNotNull(transactions.recurrence),
                        gte(transactions.date, start),
                    ),
                ),
            )
            .then((rs) => rs.map((r) => this.deserializeTransaction(r)));

        const extrapolated = txns.flatMap((txn) => {
            const dates = this.extrapolateRecurrence(
                txn.recurrence,
                txn.date,
                opts.start,
                opts.end,
            );
            return dates.map((date) => ({ ...txn, date }));
        });

        extrapolated.sort(
            (a, b) => b.date.toUnixInteger() - a.date.toUnixInteger(),
        );

        return extrapolated;
    }

    async createTransaction(txn: TxnCreate, userId: number) {
        await this.db
            .insert(transactions)
            .values({
                ...txn,
                date: txn.date.toJSDate(),
                userId,
                id: undefined,
                recurrence: txn.recurrence
                    ? this.serializeRecurrence(txn.recurrence)
                    : null,
                recurrenceEndsAt: txn.recurrence?.endsAt?.toJSDate(),
            })
            .execute();
    }

    async updateTransactionDate(id: number, userId: number, newDate: DateTime) {
        await this.db
            .update(transactions)
            .set({
                date: newDate.toJSDate(),
            })
            .where(
                and(eq(transactions.id, id), eq(transactions.userId, userId)),
            );
    }

    async updateTransactionAmount(id: number, userId: number, amount: number) {
        await this.db
            .update(transactions)
            .set({ amount })
            .where(
                and(eq(transactions.id, id), eq(transactions.userId, userId)),
            );
    }

    // -------------------- Helpers -------------------- //

    private serializeRecurrence(r: TxnRecurrence) {
        switch (r.period) {
            case 'daily':
                return [r.rate, 'D'].join(';');
            case 'weekly':
                return [r.rate, 'W', r.daysOfWeek.join(',')].join(';');
            case 'monthly':
                return [r.rate, 'M', r.daysOfMonth.join(',')].join(';');
            case 'yearly':
                return [r.rate, 'Y', r.daysOfYear.join(',')].join(';');
        }
    }

    private deserializeTransaction(raw: TxnSelectRaw) {
        const { date, recurrence, recurrenceEndsAt, ...rest } = raw;

        const r = recurrence
            ? this.deserializeRecurrence(
                  recurrence,
                  recurrenceEndsAt ?? undefined,
              )
            : null;

        return {
            ...rest,
            date: DateTime.fromJSDate(date),
            recurrence: r,
        };
    }

    private deserializeRecurrence(data: string, endsAt?: Date): TxnRecurrence {
        const parts = data.split(';');

        const rate = Number.parseInt(parts[0]);
        const period = parts[1];
        const days = parts[2];

        const base = {
            rate: rate,
            endsAt: endsAt ? DateTime.fromJSDate(endsAt) : undefined,
        } satisfies TxnRecurrenceBase;

        const splitDays = () => days.split(',').map((d) => Number.parseInt(d));

        switch (period) {
            case 'D':
                return { ...base, period: 'daily' };
            case 'W':
                return {
                    ...base,
                    period: 'weekly',
                    daysOfWeek: splitDays(),
                };
            case 'M':
                return {
                    ...base,
                    period: 'monthly',
                    daysOfMonth: splitDays(),
                };
            case 'Y':
                return {
                    ...base,
                    period: 'yearly',
                    daysOfYear: splitDays(),
                };
            default:
                throw new Error();
        }
    }

    private extrapolateRecurrence(
        recurrence: TxnRecurrence | null,
        firstDate: DateTime,
        rangeStart: DateTime,
        rangeEnd: DateTime,
    ) {
        // Obviously if there is no recurrence, no need to extrapolate
        if (recurrence === null) {
            return [firstDate];
        }

        // Our main cursor of the current date as we iterate, to handle different rates it must
        // be set to this transaction's start date (even if it is way before the start range)
        let date = firstDate;

        let endsAt = rangeEnd;
        if (recurrence.endsAt && recurrence.endsAt < endsAt) {
            endsAt = recurrence.endsAt;
        }

        // The main difference between extrapolating the recurrence periods are determining if
        // we should include a transaction on a given date, and how many days to add per iteration
        let isValidFn: () => boolean;
        let dayAddFn: () => void;

        switch (recurrence.period) {
            case 'daily':
                isValidFn = () => date >= rangeStart;
                dayAddFn = () => {
                    date = date.plus({ days: recurrence.rate });
                };
                break;

            case 'weekly':
                isValidFn = () =>
                    date >= rangeStart &&
                    recurrence.daysOfWeek.includes(date.weekday - 1);

                dayAddFn = () => {
                    date = date.plus({ days: 1 });
                    if (date.weekday === 1 && recurrence.rate > 1) {
                        // handle skipped weeks if we're now on a Monday
                        date = date.plus({ weeks: recurrence.rate - 1 });
                    }
                };

                break;

            case 'monthly':
                isValidFn = () =>
                    date >= rangeStart &&
                    recurrence.daysOfMonth.includes(date.day);

                dayAddFn = () => {
                    date = date.plus({ days: 1 });
                    if (date.day === 1 && recurrence.rate > 1) {
                        // handle skipped months if we're now on the 1st
                        date = date.plus({ months: recurrence.rate - 1 });
                    }
                };

                break;

            case 'yearly':
                isValidFn = () =>
                    date >= rangeStart &&
                    recurrence.daysOfYear.includes(date.ordinal); // FIXME: this probably doesn't work for feb 29th

                dayAddFn = () => {
                    date = date.plus({ days: 1 });
                    if (date.ordinal === 1 && recurrence.rate > 1) {
                        // handle skipped years if we're now on January 1st
                        date = date.plus({ years: recurrence.rate - 1 });
                    }
                };

                break;
        }

        // Now all we need to do is iterate from start to end
        const dates = [];
        while (date <= endsAt) {
            if (isValidFn()) {
                dates.push(date);
            }
            dayAddFn();
        }
        return dates;
    }
}
