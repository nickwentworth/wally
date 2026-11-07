import { ApiRouter, authedProcedure } from '../../api/orpc.js';
import {
    TransactionCreate,
    TransactionJson,
    transactionToJson,
    TransactionUpdate,
} from './transaction.schema.js';

export const transactionRouter = {
    allRecurring: authedProcedure
        .route({ method: 'GET' })
        .output(TransactionJson.array())
        .handler(async ({ context, input }) => {
            const txns =
                await context.services.transaction.getAllRecurringTransactions(
                    context.user.id,
                );

            return txns.map(transactionToJson);
        }),

    create: authedProcedure
        .input(TransactionCreate)
        .handler(async ({ context, input }) => {
            await context.services.transaction.createTransaction(
                input,
                context.user.id,
            );
        }),

    update: authedProcedure
        .input(TransactionUpdate)
        .handler(async ({ context, input }) => {
            await context.services.transaction.updateTransaction(
                input,
                context.user.id,
            );
        }),
} satisfies ApiRouter;
