import { MySql2Database } from 'drizzle-orm/mysql2';
import { categories } from '../../db/schema.js';
import { and, eq } from 'drizzle-orm';
import {
    CategoryCreate,
    CategoryMove,
    CategoryUpdate,
} from './category.schema.js';

/** How far to offset next order value when appending/prepending ordered categories */
const ORDERING_OFFSET = 1;

export class CategoryService {
    private db: MySql2Database;

    constructor(db: MySql2Database) {
        this.db = db;
    }

    private async getById(
        id: number,
        userId: number,
    ): Promise<Category | null> {
        return await this.db
            .select()
            .from(categories)
            .where(and(eq(categories.id, id), eq(categories.userId, userId)))
            .then((rs) => (rs.length > 0 ? rs[0] : null));
    }

    async getAll(userId: number): Promise<Category[]> {
        return await this.db
            .select()
            .from(categories)
            .where(eq(categories.userId, userId))
            .orderBy(categories.order, categories.id);
    }

    async create(create: CategoryCreate, userId: number): Promise<void> {
        const last = await this.getMaxOrdered(userId);
        const nextOrder = (last?.order ?? 0) + ORDERING_OFFSET;

        await this.db.insert(categories).values({
            name: create.name,
            icon: create.icon,
            bgColor: create.bgColor,
            fgColor: create.fgColor,
            userId,
            order: nextOrder,
        });
    }

    async update(update: CategoryUpdate, userId: number): Promise<void> {
        await this.db
            .update(categories)
            .set({
                name: update.name,
                icon: update.icon,
                bgColor: update.bgColor,
                fgColor: update.fgColor,
            })
            .where(
                and(
                    eq(categories.id, update.id),
                    eq(categories.userId, userId),
                ),
            );
    }

    async move(move: CategoryMove, userId: number): Promise<void> {
        const after =
            move.afterId !== undefined
                ? await this.getById(move.afterId, userId)
                : null;

        const before =
            move.beforeId !== undefined
                ? await this.getById(move.beforeId, userId)
                : null;

        let order: number;
        if (after && before) {
            order = (after.order + before.order) / 2;
        } else if (after && !before) {
            order = after.order + ORDERING_OFFSET;
        } else if (!after && before) {
            order = before.order - ORDERING_OFFSET;
        } else {
            throw new Error(
                'Category move request must contain afterId and/or beforeId',
            );
        }

        await this.db
            .update(categories)
            .set({ order })
            .where(
                and(eq(categories.id, move.id), eq(categories.userId, userId)),
            );
    }

    async delete(id: number, userId: number): Promise<void> {
        await this.db
            .delete(categories)
            .where(and(eq(categories.id, id), eq(categories.userId, userId)));
    }

    // TODO: implement more efficient getters here, just using getAll for convenience
    private async getMinOrdered(userId: number): Promise<Category | null> {
        const all = await this.getAll(userId);
        return all.length > 0 ? all[0] : null;
    }

    private async getMaxOrdered(userId: number): Promise<Category | null> {
        const all = await this.getAll(userId);
        return all.length > 0 ? all[all.length - 1] : null;
    }
}

type CategoryDb = typeof categories.$inferSelect;
type Category = CategoryDb;
