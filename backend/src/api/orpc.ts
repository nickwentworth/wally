import { ORPCError, os, Router } from '@orpc/server';
import { User, UserService } from '../features/auth/user.service.js';
import { SessionService } from '../features/auth/session.service.js';
import { TransactionService } from '../features/transaction/transaction.service.js';
import { CategoryService } from '../features/category/category.service.js';

export type Services = {
    user: UserService;
    session: SessionService;
    transaction: TransactionService;
    category: CategoryService;
};

type ApiBaseContext = {
    services: Services;
    user: User | null;
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
