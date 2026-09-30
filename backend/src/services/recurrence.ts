import z from 'zod';
import { LuxonDateTime } from '../util/types.js';
import { DateTime } from 'luxon';

/* ———————————————————— Types/Schema ———————————————————— */

const RecurrenceBase = z.object({
    rate: z.number(),
    endsAt: LuxonDateTime.optional(),
});
type RecurrenceBase = z.infer<typeof RecurrenceBase>;

export const Recurrence = z.discriminatedUnion('period', [
    RecurrenceBase.extend({
        period: z.literal('daily'),
    }),
    RecurrenceBase.extend({
        period: z.literal('weekly'),
        daysOfWeek: z.int().min(0).max(6).array().nonempty(),
    }),
    RecurrenceBase.extend({
        period: z.literal('monthly'),
        daysOfMonth: z.int().min(1).max(31).array().nonempty(),
    }),
    RecurrenceBase.extend({
        period: z.literal('yearly'),
        daysOfYear: z.int().min(1).max(366).array().nonempty(),
    }),
]);
export type Recurrence = z.infer<typeof Recurrence>;

/* ———————————————————— Helpers ———————————————————— */

export function serializeRecurrence(r: Recurrence) {
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

export function deserializeRecurrence(data: string, endsAt?: Date): Recurrence {
    const parts = data.split(';');

    const rate = Number.parseInt(parts[0]);
    const period = parts[1];
    const days = parts[2];

    const base = {
        rate: rate,
        endsAt: endsAt ? DateTime.fromJSDate(endsAt) : undefined,
    } satisfies RecurrenceBase;

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

export function extrapolateRecurrence(
    recurrence: Recurrence,
    firstDate: DateTime,
    rangeStart: DateTime,
    rangeEnd: DateTime,
) {
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
                date >= rangeStart && recurrence.daysOfMonth.includes(date.day);

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
