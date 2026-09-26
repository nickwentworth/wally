import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiRouterInputs, ApiRouterOutputs, trpc } from './trpc';
import {
    startOfMonthInputStr,
    startOfWeekInputStr,
    startOfYearInputStr,
    todayDateInputStr,
} from './utils';

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

export function useTransactionUpdate() {
    const qc = useQueryClient();
    return useMutation(
        trpc.txn.update.mutationOptions({
            onSuccess: () => {
                qc.invalidateQueries({
                    queryKey: trpc.txn.get.queryKey(),
                });
            },
        }),
    );
}

// -------------------- Types / Constants -------------------- //

type TxnGetOpts = ApiRouterInputs['txn']['get'];

export type Transaction =
    ApiRouterOutputs['txn']['get']['transactions'][number];

export const TXN_FILTER_RANGE_PRESETS = [
    'today',
    'week',
    'month',
    'year',
    'all',
] as const;
export type TxnFilterRangePreset = (typeof TXN_FILTER_RANGE_PRESETS)[number];

export type TxnFilterRange =
    | TxnFilterRangePreset
    | {
          from: string;
          to: string;
      };

// -------------------- Helpers -------------------- //

export function getTxnFilterRange(r: TxnFilterRange) {
    let from: string;
    let to: string;

    if (typeof r === 'string') {
        switch (r) {
            case 'today':
                from = todayDateInputStr();
                break;
            case 'week':
                from = startOfWeekInputStr();
                break;
            case 'month':
                from = startOfMonthInputStr();
                break;
            case 'year':
                from = startOfYearInputStr();
                break;
            case 'all':
                from = new Date(0).toLocaleDateString('en-CA');
                break;
        }

        to = todayDateInputStr();
    } else {
        from = r.from;
        to = r.to;
    }

    return { from, to };
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
