import { ApiRouter, authedProcedure } from '../../api/orpc.js';
import {
    occurrenceToJson,
    OccurrenceList,
    OccurrencePageJson,
    OccurrenceUpdate,
} from './occurrence.schema.js';

export const occurrenceRouter = {
    list: authedProcedure
        .input(OccurrenceList)
        .output(OccurrencePageJson)
        .handler(async ({ context, input }) => {
            const page = await context.services.transaction.listOccurrences(
                input,
                context.user.id,
            );

            return {
                ...page,
                occurrences: page.occurrences.map(occurrenceToJson),
            };
        }),

    update: authedProcedure
        .input(OccurrenceUpdate)
        .handler(async ({ context, input }) => {
            await context.services.transaction.updateOccurrence(
                input,
                context.user.id,
            );
        }),
} satisfies ApiRouter;
