import z from 'zod';
import { LuxonDateTime, OmitStrict } from '../../util/types.js';
import {
    Recurrence,
    recurrenceFromJson,
    RecurrenceJson,
    recurrenceToJson,
} from './recurrence.js';
import { DateTime } from 'luxon';

/* ———————————————————— Shared ———————————————————— */

const Amount = z.number();
const CategoryId = z.int().nullable();
const Description = z.string();

/* ———————————————————— Input ———————————————————— */

export const TransactionCreate = z.object({
    amount: Amount,
    categoryId: CategoryId,
    date: LuxonDateTime,
    description: Description,
    recurrence: RecurrenceJson.transform(recurrenceFromJson).nullable(),
});
export type TransactionCreate = z.infer<typeof TransactionCreate>;

export const TransactionUpdate = z.object({
    id: z.int(),
    amount: Amount.optional(),
    categoryId: CategoryId.optional(),
    date: LuxonDateTime.optional(),
    description: Description.optional(),
    recurrence: RecurrenceJson.transform(recurrenceFromJson).optional(),
});
export type TransactionUpdate = z.infer<typeof TransactionUpdate>;

/* ———————————————————— Output ———————————————————— */

export const TransactionJson = z.object({
    id: z.int(),
    amount: Amount,
    categoryId: CategoryId,
    date: z.string(),
    description: Description,
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
