import z from 'zod';
import { LuxonDateTime, OmitStrict } from '../../util/types.js';
import { Transaction, TransactionJson } from './transaction.schema.js';
import { recurrenceToJson } from './recurrence.js';

/* ———————————————————— Input ———————————————————— */

export const OccurrenceList = z.object({
    from: LuxonDateTime,
    to: LuxonDateTime,
    categoryIds: z.number().array().optional(),
    search: z.string().optional(),
    offset: z.int().min(0).default(0),
    limit: z.int().min(1).max(100).default(50),
});
export type OccurrenceList = z.infer<typeof OccurrenceList>;

/* ———————————————————— Output ———————————————————— */

export const OccurrenceJson = TransactionJson.omit({ id: true }).extend({
    transactionId: z.int(),
});
export type OccurrenceJson = z.infer<typeof OccurrenceJson>;

export type Occurrence = OmitStrict<Transaction, 'id'> & {
    transactionId: number;
};

export function occrrenceToJson(occ: Occurrence): OccurrenceJson {
    return {
        ...occ,
        date: occ.date.toISODate() ?? '',
        recurrence: occ.recurrence ? recurrenceToJson(occ.recurrence) : null,
    };
}

export const OccurrencePageJson = z.object({
    occurrences: OccurrenceJson.array(),
    totals: z.object({
        net: z.number(),
        income: z.number(),
        expenses: z.number(),
    }),
    count: z.int(),
});
type OccurrencePageJson = z.infer<typeof OccurrencePageJson>;

export type OccurrencePage = OmitStrict<OccurrencePageJson, 'occurrences'> & {
    occurrences: Occurrence[];
};
