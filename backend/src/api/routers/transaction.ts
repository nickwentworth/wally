import { protectedProcedure, router } from '../trpc.js';
import {
    TransactionCreate,
    TransactionUpdate,
} from '../../services/transaction.js';

export const transactionRouter = router({
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
