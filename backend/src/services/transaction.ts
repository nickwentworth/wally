import { MySql2Database } from 'drizzle-orm/mysql2';
import { transactions } from '../db/schema.js';
import z from 'zod';
import { OmitStrict } from '../util/types.js';
import { and, desc, eq, isNotNull, isNull } from 'drizzle-orm';

// -------------------- Schemas/Types -------------------- //

const TxnRecurrenceBase = z.object({
    rate: z.number(),
    endsAt: z.coerce.date().optional(),
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

export const TxnGet = z.object({
    // TODO: uncomment as options are supported
    // limit: z.number();
    // start: z.coerce.date().optional(),
    // end: z.coerce.date().optional(),
    // categoryIds: z.number().array().optional(),
    // search: z.string().optional(),
});
type TxnGet = z.infer<typeof TxnGet>;

export const TxnCreate = z.object({
    amount: z.number(),
    categoryId: z.int().optional(),
    date: z.coerce.date(),
    description: z.string().optional(),
    recurrence: TxnRecurrence.optional(),
});
type TxnCreate = z.infer<typeof TxnCreate>;

// -------------------- Service -------------------- //

export class TransactionService {
    private db: MySql2Database;

    constructor(db: MySql2Database) {
        this.db = db;
    }

    async getTransactions(opts: TxnGet, userId: number) {
        const txns = await this.db
            .select()
            .from(transactions)
            .where(and(eq(transactions.userId, userId)));

        // TODO: extrapolate, limit, sort, etc.

        return txns;
    }

    async createTransaction(txn: TxnCreate, userId: number) {
        await this.db
            .insert(transactions)
            .values({
                ...txn,
                userId,
                id: undefined,
                recurrence: txn.recurrence
                    ? this.serializeRecurrence(txn.recurrence)
                    : null,
                recurrenceEndsAt: txn.recurrence?.endsAt,
            })
            .execute();
    }

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

    private deserializeRecurrence(r: string, endsAt?: Date): TxnRecurrence {
        const parts = r.split(';');

        const rate = Number.parseInt(parts[0]);
        const period = parts[1];
        const days = parts[2];

        const base = {
            rate: rate,
            endsAt,
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
}
