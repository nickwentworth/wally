import { ORPCError, os, Router } from '@orpc/server';
import { Services } from '../services/index.js';
import { User } from '../services/user.js';

type ApiBaseContext = {
    user: User | null;
    services: Services;
};
export const apiBase = os.$context<ApiBaseContext>();

export type ApiRouter = Router<any, ApiBaseContext>;

export const publicProcedure = apiBase;

export const authedProcedure = publicProcedure.use(
    async ({ context, next }) => {
        if (!context.user) {
            throw new ORPCError('UNAUTHORIZED');
        }

        return next({
            context: {
                ...context,
                user: context.user,
            },
        });
    },
);
