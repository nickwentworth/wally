import { initTRPC, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { users } from '../db/schema.js';
import { Services, SessionService } from '../services/index.js';
import { parse } from 'cookie';

export async function createApiContext(
    options: CreateExpressContextOptions,
    services: Services,
) {
    const cookies = parse(options.req.headers.cookie ?? '');
    const sessionToken = cookies[SessionService.SESSION_COOKIE] ?? '';

    let user: typeof users.$inferSelect | null = null;

    const session = await services.session.validateSession(sessionToken);
    if (session) {
        user = await services.user.getById(session.userId);
    }

    return { services, user };
}

const t = initTRPC.context<typeof createApiContext>().create();

export const router = t.router;

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use((options) => {
    if (!options.ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return options.next({ ctx: { ...options.ctx, user: options.ctx.user } });
});
