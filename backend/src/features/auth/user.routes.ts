import { deleteCookie } from '@orpc/server/helpers';
import { ApiRouter, publicProcedure } from '../../api/orpc.js';
import { SessionService } from './session.service.js';
import { UserJson, userToJson } from './user.schema.js';

export const userRouter = {
    me: publicProcedure
        .route({ method: 'GET' })
        .output(UserJson.nullable())
        .handler(({ context }) => {
            return context.user ? userToJson(context.user) : null;
        }),

    logout: publicProcedure.handler(async ({ context }) => {
        const sessionToken = context.cookies[SessionService.SESSION_COOKIE];
        await context.services.session.deleteSession(sessionToken);

        deleteCookie(context.resHeaders, SessionService.SESSION_COOKIE, {
            path: '/',
        });
    }),
} satisfies ApiRouter;
