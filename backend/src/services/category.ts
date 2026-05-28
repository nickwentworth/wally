import { MySql2Database } from 'drizzle-orm/mysql2';
import z from 'zod';
import { categories } from '../db/schema.js';
import { and, eq } from 'drizzle-orm';

// -------------------- Schemas/Types -------------------- //

export const CATEGORY_ICONS = [
    'shoppping',
    'gift',
    'utensils',
    'car',
    'house',
    'briefcase',
] as const;

const CategoryIcon = z.enum(CATEGORY_ICONS);

export const CategorySave = z.object({
    id: z.number().optional(),
    name: z.string(),
    fgColor: z.string(),
    bgColor: z.string(),
    icon: z.enum(CATEGORY_ICONS),
});
type CategorySave = z.infer<typeof CategorySave>;

export const CategoryDelete = z.object({
    id: z.number(),
});

type CategorySelectRaw = typeof categories.$inferSelect;

// -------------------- Service -------------------- //

export class CategoryService {
    private db: MySql2Database;

    constructor(db: MySql2Database) {
        this.db = db;
    }

    async getAllCategories(userId: number) {
        return await this.db
            .select()
            .from(categories)
            .where(eq(categories.userId, userId))
            .then((rs) => rs.map(this.narrowCategorySelect));
    }

    async saveCategory(category: CategorySave, userId: number) {
        const data = {
            ...category,
            userId,
        } satisfies typeof categories.$inferInsert;

        if (category.id) {
            await this.db
                .update(categories)
                .set(data)
                .where(eq(categories.id, category.id));
        } else {
            await this.db.insert(categories).values(data);
        }
    }

    async deleteCategory(id: number, userId: number) {
        await this.db
            .delete(categories)
            .where(and(eq(categories.id, id), eq(categories.userId, userId)));
    }

    private narrowCategorySelect(raw: CategorySelectRaw) {
        return {
            ...raw,
            icon: CategoryIcon.parse(raw.icon),
        };
    }
}
