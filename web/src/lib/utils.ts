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
