import { ApiRouter, authedProcedure } from '../../api/orpc.js';
import {
    OccurrenceList,
    OccurrencePageJson,
    occurrenceToJson,
    OccurrenceUpdate,
    RecurringTransactionUpdate,
    TransactionCreate,
    RecurringTransactionJson,
    recurringTransactionToJson,
} from './transaction.schema.js';

export const transactionRouter = {
    create: authedProcedure
        .input(TransactionCreate)
        .handler(async ({ context, input }) => {
            await context.services.transaction.createTransaction(
                input,
                context.user.id,
            );
        }),

    /* ———————————————————— Recurring ———————————————————— */

    allRecurring: authedProcedure
        .route({ method: 'GET' })
        .output(RecurringTransactionJson.array())
        .handler(async ({ context }) => {
            const txns =
                await context.services.transaction.getAllRecurringTransactions(
                    context.user.id,
                );

            return txns.map(recurringTransactionToJson);
        }),

    updateRecurring: authedProcedure
        .input(RecurringTransactionUpdate)
        .handler(async ({ context, input }) => {
            await context.services.transaction.updateRecurringTransaction(
                input,
                context.user.id,
            );
        }),

    /* ———————————————————— Occurrences ———————————————————— */

    listOccurrences: authedProcedure
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

    updateOccurrence: authedProcedure
        .input(OccurrenceUpdate)
        .handler(async ({ context, input }) => {
            await context.services.transaction.updateOccurrence(
                input,
                context.user.id,
            );
        }),
} satisfies ApiRouter;
