import { ApiRouter, authedProcedure } from '../../api/orpc.js';
import {
    CategoryCreate,
    CategoryDelete,
    CategoryJson,
    CategoryMove,
    CategoryUpdate,
} from './category.schema.js';

export const categoryRouter = {
    all: authedProcedure
        .route({ method: 'GET' })
        .output(CategoryJson.array())
        .handler(async ({ context }) => {
            return await context.services.category.getAll(context.user.id);
        }),

    create: authedProcedure
        .input(CategoryCreate)
        .handler(async ({ context, input }) => {
            await context.services.category.create(input, context.user.id);
        }),

    update: authedProcedure
        .input(CategoryUpdate)
        .handler(async ({ context, input }) => {
            await context.services.category.update(input, context.user.id);
        }),

    move: authedProcedure
        .input(CategoryMove)
        .handler(async ({ context, input }) => {
            await context.services.category.move(input, context.user.id);
        }),

    delete: authedProcedure
        .input(CategoryDelete)
        .handler(async ({ context, input }) => {
            await context.services.category.delete(input.id, context.user.id);
        }),
} satisfies ApiRouter;
