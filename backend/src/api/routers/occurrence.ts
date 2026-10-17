import { OccurrenceList } from '../../services/transaction.js';
import { ApiRouter, authedProcedure } from '../orpc.js';

export const occurrenceRouter = {
    list: authedProcedure
        .input(OccurrenceList)
        .handler(async ({ context, input }) => {
            return await context.services.transaction.listOccurrences(
                input,
                context.user.id,
            );
        }),
} satisfies ApiRouter;
