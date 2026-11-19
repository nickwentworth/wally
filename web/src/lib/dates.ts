export const DATE_RANGE_PRESETS = [
    'today',
    'week',
    'month',
    'year',
    'all',
] as const;
export type DateRangePreset = (typeof DATE_RANGE_PRESETS)[number];

export type DateRange =
    | DateRangePreset
    | {
          from: string;
          to: string;
      };

// -------------------- Helpers -------------------- //

export function resolveDateRange(r: DateRange) {
    let from: string;
    let to: string;

    if (typeof r === 'string') {
        switch (r) {
            case 'today':
                from = todayDateInputStr();
                break;
            case 'week':
                from = startOfWeekInputStr();
                break;
            case 'month':
                from = startOfMonthInputStr();
                break;
            case 'year':
                from = startOfYearInputStr();
                break;
            case 'all':
                from = new Date(0).toLocaleDateString('en-CA');
                break;
        }

        to = todayDateInputStr();
    } else {
        from = r.from;
        to = r.to;
    }

    return { from, to };
}

export function todayDateInputStr() {
    const now = new Date();
    return now.toLocaleDateString('en-CA');
}

export function startOfWeekInputStr() {
    const now = new Date();
    const weekday = now.getDay(); // ranges from 0 = Sunday to 6 = Saturday

    const target = new Date(now);
    target.setHours(weekday * -24);

    return target.toLocaleDateString('en-CA');
}

export function endOfWeekInputStr() {
    const now = new Date();
    const weekday = now.getDay(); // ranges from 0 = Sunday to 6 = Saturday
    const daysLeft = 6 - weekday;

    const target = new Date(now);
    target.setHours(daysLeft * 24);

    return target.toLocaleDateString('en-CA');
}

export function startOfMonthInputStr() {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), 1);
    return target.toLocaleDateString('en-CA');
}

export function endOfMonthInputStr() {
    const now = new Date();
    // Passing day = 0 rolls back to the previous month's last day
    const target = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return target.toLocaleDateString('en-CA');
}

export function startOfYearInputStr() {
    const now = new Date();
    const target = new Date(now.getFullYear(), 0, 1);
    return target.toLocaleDateString('en-CA');
}

export function endOfYearInputStr() {
    const now = new Date();
    const target = new Date(now.getFullYear(), 11, 31);
    return target.toLocaleDateString('en-CA');
}
