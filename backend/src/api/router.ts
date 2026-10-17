import { userRouter } from '../features/auth/user.routes.js';
import { categoryRouter } from '../features/category/category.routes.js';
import { transactionRouter } from '../features/transaction/transaction.routes.js';
import { occurrenceRouter } from '../features/transaction/occurrence.routes.js';
import { apiBase } from './orpc.js';

export const apiRouter = apiBase.router({
    user: userRouter,
    category: categoryRouter,
    transaction: transactionRouter,
    occurrence: occurrenceRouter,
});
