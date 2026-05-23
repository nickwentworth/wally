import { protectedProcedure, router } from '../trpc.js';
import { TxnCreate } from '../../services/transaction.js';

export const txnRouter = router({
    create: protectedProcedure
        .input(TxnCreate)
        .mutation(async ({ ctx, input }) => {
            await ctx.services.txn.createTransaction(input, ctx.user.id);
        }),
});
