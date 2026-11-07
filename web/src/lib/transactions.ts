import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiInput, ApiOutput, unwrap } from './api';
import { occurrenceKey } from './occurrences';

// -------------------- Hooks -------------------- //

export const transactionKey = ['transaction'];

export function useRecurringTransactions() {
    return useQuery({
        queryFn: () => unwrap(apiClient.GET('/transaction/allRecurring')),
        queryKey: [...transactionKey, 'recurring'],
    });
}

type UseTxnCreateOpts = {
    onSuccess?: () => void;
};

export function useTransactionCreate(opts: UseTxnCreateOpts) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (transaction: ApiInput<'/transaction/create', 'post'>) =>
            unwrap(
                apiClient.POST('/transaction/create', { body: transaction }),
            ),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: transactionKey });
            qc.invalidateQueries({ queryKey: occurrenceKey });
            opts.onSuccess?.();
        },
    });
}

type UseTxnUpdateOpts = {
    onSuccess?: () => void;
};

export function useTransactionUpdate(opts: UseTxnUpdateOpts) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (transaction: ApiInput<'/transaction/update', 'post'>) =>
            unwrap(
                apiClient.POST('/transaction/update', { body: transaction }),
            ),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: transactionKey });
            qc.invalidateQueries({ queryKey: occurrenceKey });
            opts.onSuccess?.();
        },
    });
}

/* -------------------- Types / Constants -------------------- */

export type Transaction = ApiOutput<'/transaction/allRecurring', 'get'>[number];

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
