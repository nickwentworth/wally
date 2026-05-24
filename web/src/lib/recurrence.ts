import { TxnFormRecur } from '../components/TransactionForm';
import { ordinalSuffix, sameItems } from './utils';

// -------------------- Constants -------------------- //

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

export function formatRecurrenceName(r: TxnFormRecur) {
    let formatted = '';

    // FIXME: == is required instead of ===, since the input is stored as a string
    if (r.rate == 1) {
        if (r.period === 'day') {
            formatted += 'Daily';
        } else {
            formatted +=
                r.period.charAt(0).toUpperCase() + r.period.slice(1) + 'ly';
        }
    } else {
        formatted += `Every ${r.rate} ${r.period}s`;
    }

    switch (r.period) {
        case 'day':
            break; // No day info for daily recurrence

        case 'week':
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

        case 'month':
            const days = r.daysOfMonth.map((d) => `${d}${ordinalSuffix(d)}`);
            formatted += ` on the ${days.join(', ')}`;
            break;

        case 'year':
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
