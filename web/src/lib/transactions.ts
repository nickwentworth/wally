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

export function useTransactionSingleFieldEdits() {
    const qc = useQueryClient();

    const invalidateTxns = () =>
        qc.invalidateQueries({
            queryKey: trpc.txn.get.queryKey(),
        });

    const updateDate = useMutation(
        trpc.txn.updateDate.mutationOptions({
            onSuccess: invalidateTxns,
        }),
    );

    return { updateDate } as const;
}

// -------------------- Types / Constants -------------------- //

type TxnGetOpts = ApiRouterInputs['txn']['get'];

export type Transaction = ApiRouterOutputs['txn']['get'][number];

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

export function getTxnFilterRange(r: TxnFilterRange) {
    let start: string;
    let end: string;

    if (typeof r === 'string') {
        switch (r) {
            case 'today':
                start = todayDateInputStr();
                break;
            case 'week':
                start = startOfWeekInputStr();
                break;
            case 'month':
                start = startOfMonthInputStr();
                break;
            case 'year':
                start = startOfYearInputStr();
                break;
            case 'all':
                start = new Date(0).toLocaleDateString('en-CA');
                break;
        }

        end = todayDateInputStr();
    } else {
        start = r.from;
        end = r.to;
    }

    return { start, end };
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
