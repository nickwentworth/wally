import z from 'zod';

// TODO: Maybe have frontend be the source of category icons
export const CategoryIcon = z.enum([
    'shoppping',
    'gift',
    'utensils',
    'car',
    'house',
    'briefcase',
]);
export type CategoryIcon = z.infer<typeof CategoryIcon>;

/* ———————————————————— Input ———————————————————— */

export const CategorySave = z.object({
    id: z.number().optional(),
    name: z.string(),
    icon: CategoryIcon,
    fgColor: z.string(),
    bgColor: z.string(),
});
export type CategorySave = z.infer<typeof CategorySave>;

export const CategoryDelete = z.object({
    id: z.number(),
});
export type CategoryDelete = z.infer<typeof CategoryDelete>;

/* ———————————————————— Output ———————————————————— */

export const CategoryJson = z.object({
    id: z.int(),
    name: z.string(),
    icon: CategoryIcon,
    fgColor: z.string(),
    bgColor: z.string(),
});
export type CategoryJson = z.infer<typeof CategoryJson>;

export type Category = CategoryJson;
