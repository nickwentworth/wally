import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { Services } from '../services/index.js';
import { txnRouter } from './routers/transaction.js';
import { userRouter } from './routers/user.js';
import { createApiContext, router } from './trpc.js';
import { categoryRouter } from './routers/category.js';

const apiRouter = router({
    user: userRouter,
    category: categoryRouter,
    txn: txnRouter,
});

export type ApiRouter = typeof apiRouter;

export type ApiRouterInputs = inferRouterInputs<ApiRouter>;
export type ApiRouterOutputs = inferRouterOutputs<ApiRouter>;

export function buildApiHandler(services: Services) {
    return createExpressMiddleware({
        router: apiRouter,
        createContext: (options) => createApiContext(options, services),
    });
}
