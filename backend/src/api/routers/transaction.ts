import { protectedProcedure, router } from '../trpc.js';
import { TxnCreate, TxnGet } from '../../services/transaction.js';
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

    updateDate: protectedProcedure
        .input(
            z.object({
                id: z.number(),
                date: LuxonDateTime,
            }),
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.services.txn.updateTransactionDate(
                input.id,
                ctx.user.id,
                input.date,
            );
        }),

    updateAmount: protectedProcedure
        .input(
            z.object({
                id: z.number(),
                amount: z.number(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.services.txn.updateTransactionAmount(
                input.id,
                ctx.user.id,
                input.amount,
            );
        }),
});
