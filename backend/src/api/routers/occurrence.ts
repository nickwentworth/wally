import { OccurrenceList } from '../../services/transaction.js';
import { protectedProcedure, router } from '../trpc.js';

export const occurrenceRouter = router({
    list: protectedProcedure
        .input(OccurrenceList)
        .query(async ({ ctx, input }) => {
            return await ctx.services.transaction.listOccurrences(
                input,
                ctx.user.id,
            );
        }),
});
