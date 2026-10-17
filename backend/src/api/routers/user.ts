import { ApiRouter, publicProcedure } from '../orpc.js';

export const userRouter = {
    me: publicProcedure
        .route({ method: 'GET' })
        .handler(({ context }) => context.user),
} satisfies ApiRouter;
