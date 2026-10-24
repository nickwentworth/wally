import { ApiRouter, authedProcedure } from '../../api/orpc.js';
import {
    TransactionCreate,
    transactionToJson,
    TransactionJson,
    TransactionList,
    TransactionUpdate,
} from './transaction.schema.js';

export const transactionRouter = {
    list: authedProcedure
        .input(TransactionList)
        .output(TransactionJson.array())
        .handler(async ({ context, input }) => {
            const txns = await context.services.transaction.list(
                input,
                context.user.id,
            );
            return txns.map(transactionToJson);
        }),

    create: authedProcedure
        .input(TransactionCreate)
        .handler(async ({ context, input }) => {
            await context.services.transaction.create(input, context.user.id);
        }),

    update: authedProcedure
        .input(TransactionUpdate)
        .handler(async ({ context, input }) => {
            await context.services.transaction.update(input, context.user.id);
        }),
} satisfies ApiRouter;
