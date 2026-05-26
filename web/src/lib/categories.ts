import { Category } from './trpc';

export const CATEGORY_COLORS = [
    { bg: '#FBD4D9', fg: '#8A1F31' },
    { bg: '#FCD7C4', fg: '#8A3513' },
    { bg: '#FAE3B8', fg: '#7A4E0B' },
    { bg: '#F7EBB0', fg: '#6B5400' },
    { bg: '#DEEDB6', fg: '#3E5A09' },
    { bg: '#C8E4CE', fg: '#1E5A32' },
    { bg: '#BDE6D7', fg: '#0F5A3F' },
    { bg: '#B9E1E2', fg: '#0B4D57' },
    { bg: '#C5DEEE', fg: '#0F4B70' },
    { bg: '#C9D7F1', fg: '#1E3B80' },
    { bg: '#D4CFF0', fg: '#30268A' },
    { bg: '#E0CDEE', fg: '#4A1D82' },
    { bg: '#EDCFE4', fg: '#6E1569' },
    { bg: '#ECD1DB', fg: '#6B1A41' },
    { bg: '#DDD7C8', fg: '#4F4628' },
] as const;

export function getCategoryColorIdx(category: Category) {
    const idx = CATEGORY_COLORS.findIndex(
        (color) =>
            color.bg === category.bgColor && color.fg === category.fgColor,
    );

    return Math.max(idx, 0);
}
