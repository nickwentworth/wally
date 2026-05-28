import { CategoryDelete, CategorySave } from '../../services/category.js';
import { protectedProcedure, router } from '../trpc.js';

export const categoryRouter = router({
    all: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.services.category.getAllCategories(ctx.user.id);
    }),

    save: protectedProcedure
        .input(CategorySave)
        .mutation(async ({ ctx, input }) => {
            await ctx.services.category.saveCategory(input, ctx.user.id);
        }),

    delete: protectedProcedure
        .input(CategoryDelete)
        .mutation(async ({ ctx, input }) => {
            await ctx.services.category.deleteCategory(input.id, ctx.user.id);
        }),
});
