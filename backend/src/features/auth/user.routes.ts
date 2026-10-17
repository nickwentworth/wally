import { ApiRouter, publicProcedure } from '../../api/orpc.js';

export const userRouter = {
    me: publicProcedure
        .route({ method: 'GET' })
        .handler(({ context }) => context.user),
} satisfies ApiRouter;
