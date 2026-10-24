import { ApiRouter, publicProcedure } from '../../api/orpc.js';
import { UserJson, userToJson } from './user.schema.js';

export const userRouter = {
    me: publicProcedure
        .route({ method: 'GET' })
        .output(UserJson.nullable())
        .handler(({ context }) => {
            return context.user ? userToJson(context.user) : null;
        }),
} satisfies ApiRouter;
