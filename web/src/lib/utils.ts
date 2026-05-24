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
