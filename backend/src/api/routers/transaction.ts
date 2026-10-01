import { protectedProcedure, router } from '../trpc.js';
import {
    TransactionCreate,
    TransactionList,
    TransactionUpdate,
} from '../../services/transaction.js';

export const transactionRouter = router({
    list: protectedProcedure
        .input(TransactionList)
        .query(async ({ ctx, input }) => {
            return await ctx.services.transaction.list(input, ctx.user.id);
        }),

    create: protectedProcedure
        .input(TransactionCreate)
        .mutation(async ({ ctx, input }) => {
            await ctx.services.transaction.create(input, ctx.user.id);
        }),

    update: protectedProcedure
        .input(TransactionUpdate)
        .mutation(async ({ ctx, input }) => {
            await ctx.services.transaction.update(input, ctx.user.id);
        }),
});
