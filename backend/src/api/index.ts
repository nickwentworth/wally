import { initTRPC } from '@trpc/server';
import {
    CreateExpressContextOptions,
    createExpressMiddleware,
} from '@trpc/server/adapters/express';
import { users } from '../db/schema.js';
import { Services, SessionService } from '../services/index.js';
import { parse } from 'cookie';

async function createApiContext(
    options: CreateExpressContextOptions,
    services: Services,
) {
    const cookies = parse(options.req.headers.cookie ?? '');
    const sessionToken = cookies[SessionService.SESSION_COOKIE];

    let user: typeof users.$inferSelect | null = null;

    const session = await services.session.validateSession(sessionToken);
    if (session) {
        user = await services.user.getById(session.userId);
    }

    return { services, user };
}

const t = initTRPC.context<typeof createApiContext>().create();

const apiRouter = t.router({
    me: t.procedure.query(({ ctx }) => ctx.user),
});

export type ApiRouter = typeof apiRouter;

export function buildApiHandler(services: Services) {
    return createExpressMiddleware({
        router: apiRouter,
        createContext: (options) => createApiContext(options, services),
    });
}
