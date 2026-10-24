import { MySql2Database } from 'drizzle-orm/mysql2';
import { categories } from '../../db/schema.js';
import { and, eq } from 'drizzle-orm';
import { Category, CategoryIcon, CategorySave } from './category.schema.js';

export class CategoryService {
    private db: MySql2Database;

    constructor(db: MySql2Database) {
        this.db = db;
    }

    async getAllCategories(userId: number): Promise<Category[]> {
        return await this.db
            .select()
            .from(categories)
            .where(eq(categories.userId, userId))
            .then((rs) => rs.map(categoryFromDb));
    }

    async saveCategory(category: CategorySave, userId: number): Promise<void> {
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

    async deleteCategory(id: number, userId: number): Promise<void> {
        await this.db
            .delete(categories)
            .where(and(eq(categories.id, id), eq(categories.userId, userId)));
    }
}

type CategorySelect = typeof categories.$inferSelect;

function categoryFromDb(category: CategorySelect): Category {
    return {
        ...category,
        icon: CategoryIcon.parse(category.icon),
    };
}
