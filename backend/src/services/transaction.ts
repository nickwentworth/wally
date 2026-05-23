import { MySql2Database } from 'drizzle-orm/mysql2';
import { transactions } from '../db/schema.js';
import z from 'zod';
import { OmitStrict } from '../util/types.js';

// -------------------- Schemas/Types -------------------- //

const TxnRecurrenceBase = z.object({
    rate: z.number(),
    endsAt: z.coerce.date().optional(),
});

const TxnRecurrence = z.discriminatedUnion('period', [
    TxnRecurrenceBase.extend({
        period: z.literal('daily'),
    }),
    TxnRecurrenceBase.extend({
        period: z.literal('weekly'),
        daysOfWeek: z.number().int().min(0).max(6).array().nonempty(),
    }),
    TxnRecurrenceBase.extend({
        period: z.literal('monthly'),
        daysOfMonth: z.number().int().min(1).max(31).array().nonempty(),
    }),
    TxnRecurrenceBase.extend({
        period: z.literal('yearly'),
        daysOfYear: z.number().int().min(1).max(366).array(),
    }),
]);
type TxnRecurrence = z.infer<typeof TxnRecurrence>;

export const TxnCreate = z.object({
    amount: z.number(),
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
}
