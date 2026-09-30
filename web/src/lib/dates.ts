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

function startOfWeekInputStr() {
    const now = new Date();
    const weekday = now.getDay(); // ranges from 1 = Monday to 7 = Sunday

    if (weekday !== 7) {
        // Only go back if we're not on Sunday already
        now.setHours(weekday * -24);
    }

    return now.toLocaleDateString('en-CA');
}

function startOfMonthInputStr() {
    const now = new Date();
    now.setDate(1);
    return now.toLocaleDateString('en-CA');
}

function startOfYearInputStr() {
    const now = new Date();
    now.setDate(1);
    now.setMonth(0);
    return now.toLocaleDateString('en-CA');
}
