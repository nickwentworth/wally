import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiRouterInputs, ApiRouterOutputs, trpc } from './trpc';

// -------------------- Hooks -------------------- //

export function useTransactions(opts: ApiRouterInputs['transaction']['list']) {
    return useQuery(trpc.transaction.list.queryOptions(opts));
}

type UseTxnCreateOpts = {
    onSuccess?: () => void;
};

export function useTransactionCreate(opts: UseTxnCreateOpts) {
    const qc = useQueryClient();

    return useMutation(
        trpc.transaction.create.mutationOptions({
            onSuccess: () => {
                qc.invalidateQueries({
                    queryKey: trpc.occurrence.list.queryKey(),
                });
                opts.onSuccess?.();
            },
        }),
    );
}

export function useTransactionUpdate() {
    const qc = useQueryClient();

    return useMutation(
        trpc.transaction.update.mutationOptions({
            onSuccess: () => {
                // TODO: can these be combined?
                qc.invalidateQueries({
                    queryKey: trpc.transaction.list.queryKey(),
                });
                qc.invalidateQueries({
                    queryKey: trpc.occurrence.list.queryKey(),
                });
            },
        }),
    );
}

/* -------------------- Types / Constants -------------------- */

export type Transaction = ApiRouterOutputs['transaction']['list'][number];

// -------------------- Helpers -------------------- //

export function formatDollar(amount: number) {
    let sign;
    if (amount > 0) {
        sign = '+';
    } else if (amount < 0) {
        sign = '-';
    } else {
        sign = '';
    }

    let dollar = Math.abs(amount).toFixed(2);

    return `${sign}\$${dollar}`;
}
