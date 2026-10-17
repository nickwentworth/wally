import { userRouter } from './routers/user.js';
import { categoryRouter } from './routers/category.js';
import { transactionRouter } from './routers/transaction.js';
import { occurrenceRouter } from './routers/occurrence.js';
import { apiBase } from './orpc.js';

export const apiRouter = apiBase.router({
    user: userRouter,
    category: categoryRouter,
    transaction: transactionRouter,
    occurrence: occurrenceRouter,
});
