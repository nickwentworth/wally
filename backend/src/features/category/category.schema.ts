import z from 'zod';

/* ———————————————————— Shared ———————————————————— */

const Id = z.int();
const Name = z.string();
const Color = z.string();
const CategoryIcon = z.string();

/* ———————————————————— Category ———————————————————— */

export const CategoryJson = z.object({
    id: Id,
    name: Name,
    icon: CategoryIcon,
    fgColor: Color,
    bgColor: Color,
});
export type CategoryJson = z.infer<typeof CategoryJson>;

/* ———————————————————— Route Inputs ———————————————————— */

export const CategoryCreate = z.object({
    name: Name,
    icon: CategoryIcon,
    fgColor: Color,
    bgColor: Color,
});
export type CategoryCreate = z.infer<typeof CategoryCreate>;

export const CategoryUpdate = z.object({
    id: Id,
    name: Name.optional(),
    icon: CategoryIcon.optional(),
    fgColor: Color.optional(),
    bgColor: Color.optional(),
});
export type CategoryUpdate = z.infer<typeof CategoryUpdate>;

export const CategoryMove = z.object({
    id: Id,
    afterId: Id.optional(),
    beforeId: Id.optional(),
});
export type CategoryMove = z.infer<typeof CategoryMove>;

export const CategoryDelete = z.object({
    id: Id,
});
export type CategoryDelete = z.infer<typeof CategoryDelete>;
