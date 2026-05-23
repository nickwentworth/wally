import { publicProcedure, router } from '../trpc.js';

export const userRouter = router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
});
