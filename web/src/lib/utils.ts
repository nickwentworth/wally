type ClassValue = string | [boolean, string];

export function buildClass(...values: ClassValue[]) {
    return values
        .map((value) => {
            if (typeof value === 'string') {
                return value;
            } else {
                return value[0] ? value[1] : null;
            }
        })
        .filter((str) => !!str)
        .join(' ');
}

export function todayDateInputStr() {
    const now = new Date();
    return now.toLocaleDateString('en-CA');
}

export function startOfWeekInputStr() {
    const now = new Date();
    const weekday = now.getDay(); // ranges from 1 = Monday to 7 = Sunday

    if (weekday !== 7) {
        // Only go back if we're not on Sunday already
        now.setHours(weekday * -24);
    }

    return now.toLocaleDateString('en-CA');
}

export function startOfMonthInputStr() {
    const now = new Date();
    now.setDate(1);
    return now.toLocaleDateString('en-CA');
}

export function startOfYearInputStr() {
    const now = new Date();
    now.setDate(1);
    now.setMonth(0);
    return now.toLocaleDateString('en-CA');
}

export function ordinalSuffix(n: number) {
    if ([11, 12, 13].includes(n)) {
        return 'th';
    }

    const lastDigit = n % 10;
    switch (lastDigit) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

export function sameItems<T>(a: T[], b: T[]) {
    return a.length === b.length && a.every((item) => b.includes(item));
}
