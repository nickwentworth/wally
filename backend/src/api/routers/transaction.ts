import { protectedProcedure, router } from '../trpc.js';
import { TxnCreate, TxnGet, TxnUpdate } from '../../services/transaction.js';
import z from 'zod';
import { LuxonDateTime } from '../../util/types.js';

export const txnRouter = router({
    get: protectedProcedure.input(TxnGet).query(async ({ ctx, input }) => {
        return await ctx.services.txn.getTransactions(input, ctx.user.id);
    }),

    create: protectedProcedure
        .input(TxnCreate)
        .mutation(async ({ ctx, input }) => {
            await ctx.services.txn.createTransaction(input, ctx.user.id);
        }),

    update: protectedProcedure
        .input(TxnUpdate)
        .mutation(async ({ ctx, input }) => {
            await ctx.services.txn.updateTransaction(input, ctx.user.id);
        }),
});
