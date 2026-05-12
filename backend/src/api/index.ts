import { initTRPC } from '@trpc/server';
import {
    CreateExpressContextOptions,
    createExpressMiddleware,
} from '@trpc/server/adapters/express';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { users } from '../db/schema.js';

function createApiContext(
    db: MySql2Database,
    options: CreateExpressContextOptions,
) {
    return { db };
}

const t = initTRPC.context<typeof createApiContext>().create();

const apiRouter = t.router({
    me: t.procedure.query(async ({ ctx }) => {
        const me = await ctx.db
            .select()
            .from(users)
            .then((rs) => rs[0]);

        return me;
    }),
});

export type ApiRouter = typeof apiRouter;

export function buildApiHandler(db: MySql2Database) {
    return createExpressMiddleware({
        router: apiRouter,
        createContext: (options) => createApiContext(db, options),
    });
}
