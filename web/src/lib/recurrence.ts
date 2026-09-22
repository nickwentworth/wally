import { Transaction } from './transactions';
import { ordinalSuffix, sameItems } from './utils';

// -------------------- Types / Constants -------------------- //

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
    ? Omit<T, K>
    : never;

type Recurrence = NonNullable<Transaction['recurrence']>;
type RecurrenceParts = DistributiveOmit<Recurrence, 'endsAt'>;

export const WEEKDAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
] as const;

export const MONTHS = [
    { month: 'January', days: 31 },
    { month: 'February', days: 29 },
    { month: 'March', days: 31 },
    { month: 'April', days: 30 },
    { month: 'May', days: 31 },
    { month: 'June', days: 30 },
    { month: 'July', days: 31 },
    { month: 'August', days: 31 },
    { month: 'September', days: 30 },
    { month: 'October', days: 31 },
    { month: 'November', days: 30 },
    { month: 'December', days: 31 },
] as const;
export type Month = (typeof MONTHS)[number]['month'];

// -------------------- Helpers -------------------- //

export function formatRecurrenceName(r: RecurrenceParts) {
    let formatted = '';

    if (r.rate === 1) {
        formatted += r.period.charAt(0).toUpperCase() + r.period.slice(1);
    } else {
        const nouns = {
            daily: 'days',
            weekly: 'weeks',
            monthly: 'months',
            yearly: 'years',
        } satisfies Record<Recurrence['period'], string>;

        formatted += `Every ${r.rate} ${nouns[r.period]}`;
    }

    switch (r.period) {
        case 'daily':
            break; // No day info for daily recurrence

        case 'weekly':
            const weekdays = r.daysOfWeek.map((d) => WEEKDAYS[d]);

            if (sameItems(weekdays, ['Saturday', 'Sunday'])) {
                formatted += ' on weekends';
            } else if (
                sameItems(weekdays, [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                ])
            ) {
                formatted += ' on weekdays';
            } else {
                formatted += ' on ' + weekdays.join(', ');
            }
            break;

        case 'monthly':
            const days = r.daysOfMonth.map((d) => `${d}${ordinalSuffix(d)}`);
            formatted += ` on the ${days.join(', ')}`;
            break;

        case 'yearly':
            const dates = r.daysOfYear.map((d) => getFormattedMonthAndDay(d));
            formatted += ` on ${dates.join(', ')}`;
            break;
    }

    return formatted;
}

export function getDayOfYear(month: Month, dayOfMonth: number) {
    let daysBefore = 0;

    for (const m of MONTHS) {
        if (m.month === month) {
            break;
        } else {
            daysBefore += m.days;
        }
    }

    return daysBefore + dayOfMonth;
}

export function getMonthAndDay(dayOfYear: number) {
    let monthIdx = 0;
    let daysCounter = dayOfYear;

    for (const m of MONTHS) {
        if (daysCounter <= m.days) {
            break;
        } else {
            monthIdx += 1;
            daysCounter -= m.days;
        }
    }

    return [MONTHS[monthIdx], daysCounter] as const;
}

export function getFormattedMonthAndDay(dayOfYear: number) {
    const [month, dayOfMonth] = getMonthAndDay(dayOfYear);
    return `${month.month} ${dayOfMonth}${ordinalSuffix(dayOfMonth)}`;
}
