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

const IsoDate = z.string();

const OccurrenceRef = z.int(); // TODO: implement

const Totals = z.object({
    net: Amount,
    income: Amount,
    expenses: Amount,
});

/* ———————————————————— Occurrence ———————————————————— */

const OccurrenceJson = z.object({
    id: OccurrenceRef,
    date: IsoDate,
    amount: Amount,
    categoryId: CategoryId,
    description: Description,
    recurringTransactionId: z.int().nullable(),
});
type OccurrenceJson = z.infer<typeof OccurrenceJson>;

export type Occurrence = OmitStrict<OccurrenceJson, 'date'> & {
    date: DateTime;
};

export function occurrenceToJson(occ: Occurrence): OccurrenceJson {
    return {
        ...occ,
        date: occ.date.toISODate() ?? '',
    };
}

export const OccurrencePageJson = z.object({
    occurrences: OccurrenceJson.array(),
    totals: Totals,
    count: z.int(),
});
type OccurrencePageJson = z.infer<typeof OccurrencePageJson>;

export type OccurrencePage = OmitStrict<OccurrencePageJson, 'occurrences'> & {
    occurrences: Occurrence[];
};

/* ———————————————————— Recurring ———————————————————— */

export const RecurringTransactionJson = z.object({
    id: z.int(),
    startsAt: IsoDate,
    amount: Amount,
    categoryId: CategoryId,
    description: Description,
    recurrence: RecurrenceJson,
});
type RecurringTransactionJson = z.infer<typeof RecurringTransactionJson>;

export type RecurringTransaction = OmitStrict<
    RecurringTransactionJson,
    'startsAt' | 'recurrence'
> & {
    startsAt: DateTime;
    recurrence: Recurrence;
};

export function recurringTransactionToJson(
    txn: RecurringTransaction,
): RecurringTransactionJson {
    return {
        ...txn,
        startsAt: txn.startsAt.toISODate() ?? '',
        recurrence: recurrenceToJson(txn.recurrence),
    };
}

export const RecurringTransactionListResultJson = z.object({
    transactions: RecurringTransactionJson.array(),
    totals: Totals,
});
type RecurringTransactionListResultJson = z.infer<
    typeof RecurringTransactionListResultJson
>;

export type RecurringTransactionListResult = OmitStrict<
    RecurringTransactionListResultJson,
    'transactions'
> & {
    transactions: RecurringTransaction[];
};

/* ———————————————————— Route Inputs ———————————————————— */

export const TransactionCreate = z.object({
    amount: Amount,
    categoryId: CategoryId,
    date: LuxonDateTime,
    description: Description,
    recurrence: RecurrenceJson.transform(recurrenceFromJson).nullable(),
});
export type TransactionCreate = z.infer<typeof TransactionCreate>;

export const RecurringTransactionUpdate = z.object({
    id: z.int(),
    amount: Amount.optional(),
    categoryId: CategoryId.optional(),
    description: Description.optional(),
    recurrence: RecurrenceJson.transform(recurrenceFromJson).optional(),
});
export type RecurringTransactionUpdate = z.infer<
    typeof RecurringTransactionUpdate
>;

export const OccurrenceList = z.object({
    from: LuxonDateTime,
    to: LuxonDateTime,
    categoryIds: z.number().array().optional(),
    search: z.string().optional(),
    offset: z.int().min(0).default(0),
    limit: z.int().min(1).max(100).default(50),
});
export type OccurrenceList = z.infer<typeof OccurrenceList>;

export const OccurrenceUpdate = z.object({
    // TODO: occurs on not technically needed, once occurence references are setup
    occursOn: LuxonDateTime,
    id: OccurrenceRef,
    amount: Amount.optional(),
    categoryId: CategoryId.optional(),
    date: LuxonDateTime.optional(),
    description: Description.optional(),
});
export type OccurrenceUpdate = z.infer<typeof OccurrenceUpdate>;
