import { ApiRouter, authedProcedure } from '../../api/orpc.js';
import { OccurrenceList } from './transaction.service.js';

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
