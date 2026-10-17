import { ApiRouter, authedProcedure } from '../../api/orpc.js';
import {
    TransactionCreate,
    TransactionList,
    TransactionUpdate,
} from './transaction.service.js';

export const transactionRouter = {
    list: authedProcedure
        .input(TransactionList)
        .handler(async ({ context, input }) => {
            return await context.services.transaction.list(
                input,
                context.user.id,
            );
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
