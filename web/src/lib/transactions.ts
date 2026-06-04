import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiRouterInputs, ApiRouterOutputs, trpc } from './trpc';

// -------------------- Hooks -------------------- //

export function useTransactions(opts: TxnGetOpts) {
    return useQuery(trpc.txn.get.queryOptions(opts));
}

type UseTxnCreateOpts = {
    onSuccess?: () => void;
};

export function useTransactionCreate(opts: UseTxnCreateOpts) {
    const qc = useQueryClient();
    return useMutation(
        trpc.txn.create.mutationOptions({
            onSuccess: () => {
                qc.invalidateQueries({
                    queryKey: trpc.txn.get.queryKey(),
                });
                opts.onSuccess?.();
            },
        }),
    );
}

// -------------------- Types / Constants -------------------- //

type TxnGetOpts = ApiRouterInputs['txn']['get'];

type Transaction = ApiRouterOutputs['txn']['get'][number];

// -------------------- Helpers -------------------- //

export function calculateTotals(txns: Transaction[]) {
    let income = 0;
    let expense = 0;

    txns.forEach((txn) => {
        if (txn.amount > 0) {
            income += txn.amount;
        } else {
            expense += txn.amount;
        }
    });

    return {
        income,
        expense,
        net: income + expense,
    } as const;
}

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
