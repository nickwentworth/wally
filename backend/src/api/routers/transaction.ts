import { protectedProcedure, router } from '../trpc.js';
import { TxnCreate, TxnGet } from '../../services/transaction.js';

export const txnRouter = router({
    get: protectedProcedure.input(TxnGet).query(async ({ ctx, input }) => {
        return await ctx.services.txn.getTransactions({}, ctx.user.id);
    }),

    create: protectedProcedure
        .input(TxnCreate)
        .mutation(async ({ ctx, input }) => {
            await ctx.services.txn.createTransaction(input, ctx.user.id);
        }),
});
