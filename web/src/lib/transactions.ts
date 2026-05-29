import { useQuery } from '@tanstack/react-query';
import { ApiRouterOutputs, trpc } from './trpc';

// -------------------- Hooks -------------------- //

export function useTransactions() {
    return useQuery(trpc.txn.get.queryOptions({}));
}

// -------------------- Types / Constants -------------------- //

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
