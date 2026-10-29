import { ApiRouter, authedProcedure } from '../../api/orpc.js';
import {
    occurrenceToJson,
    OccurrenceList,
    OccurrencePageJson,
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
} satisfies ApiRouter;
