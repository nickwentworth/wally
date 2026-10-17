import { ApiRouter, authedProcedure } from '../../api/orpc.js';
import { CategoryDelete, CategorySave } from './category.service.js';

export const categoryRouter = {
    all: authedProcedure
        .route({ method: 'GET' })
        .handler(async ({ context }) => {
            return await context.services.category.getAllCategories(
                context.user.id,
            );
        }),

    save: authedProcedure
        .input(CategorySave)
        .handler(async ({ context, input }) => {
            await context.services.category.saveCategory(
                input,
                context.user.id,
            );
        }),

    delete: authedProcedure
        .input(CategoryDelete)
        .handler(async ({ context, input }) => {
            await context.services.category.deleteCategory(
                input.id,
                context.user.id,
            );
        }),
} satisfies ApiRouter;
