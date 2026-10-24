import z from 'zod';
import { LuxonDateTime, OmitStrict } from '../../util/types.js';
import {
    Recurrence,
    recurrenceFromJson,
    RecurrenceJson,
    recurrenceToJson,
} from './recurrence.js';
import { DateTime } from 'luxon';

/* ———————————————————— Input ———————————————————— */

export const TransactionList = z.object({
    recurringOnly: z.boolean().default(false),
});
export type TransactionList = z.infer<typeof TransactionList>;

export const TransactionCreate = z.object({
    amount: z.number(),
    categoryId: z.int().optional(),
    date: LuxonDateTime,
    description: z.string().optional(),
    recurrence: RecurrenceJson.transform(recurrenceFromJson).optional(),
});
export type TransactionCreate = z.infer<typeof TransactionCreate>;

export const TransactionUpdate = z.object({
    id: z.int(),
    amount: z.number().optional(),
    categoryId: z.int().nullable().optional(),
    date: LuxonDateTime.optional(),
    description: z.string().optional(),
});
export type TransactionUpdate = z.infer<typeof TransactionUpdate>;

/* ———————————————————— Output ———————————————————— */

export const TransactionJson = z.object({
    id: z.int(),
    amount: z.number(), // TODO: more advanced schema handling here?
    categoryId: z.int().nullable(),
    date: z.string(),
    description: z.string(),
    recurrence: RecurrenceJson.nullable(),
});
export type TransactionJson = z.infer<typeof TransactionJson>;

export type Transaction = OmitStrict<TransactionJson, 'date' | 'recurrence'> & {
    date: DateTime;
    recurrence: Recurrence | null;
    userId: number;
};

export function transactionToJson(txn: Transaction): TransactionJson {
    return {
        ...txn,
        date: txn.date.toISODate() ?? '',
        recurrence: txn.recurrence ? recurrenceToJson(txn.recurrence) : null,
    };
}
