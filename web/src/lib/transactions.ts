import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trpc } from './trpc';

// -------------------- Hooks -------------------- //

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
                qc.invalidateQueries({
                    queryKey: trpc.occurrence.list.queryKey(),
                });
            },
        }),
    );
}

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
