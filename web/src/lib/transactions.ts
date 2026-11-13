import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiInput, ApiOutput, unwrap } from './api';

// -------------------- Hooks -------------------- //

export const transactionKey = ['transaction'];

export function useRecurringTransactions() {
    return useQuery({
        queryFn: () => unwrap(apiClient.GET('/transaction/allRecurring')),
        queryKey: [...transactionKey, 'recurring'],
    });
}

export function useOccurrences(
    opts: ApiInput<'/transaction/listOccurrences', 'post'>,
) {
    return useQuery({
        queryFn: () =>
            unwrap(
                apiClient.POST('/transaction/listOccurrences', { body: opts }),
            ),
        queryKey: [...transactionKey, 'list', opts],
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
        mutationFn: (
            transaction: ApiInput<'/transaction/updateRecurring', 'post'>,
        ) =>
            unwrap(
                apiClient.POST('/transaction/updateRecurring', {
                    body: transaction,
                }),
            ),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: transactionKey });
            opts.onSuccess?.();
        },
    });
}

export function useOccurrenceUpdate() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (
            input: ApiInput<'/transaction/updateOccurrence', 'post'>,
        ) =>
            unwrap(
                apiClient.POST('/transaction/updateOccurrence', {
                    body: input,
                }),
            ),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: transactionKey });
        },
    });
}

/* -------------------- Types / Constants -------------------- */

export type Transaction = ApiOutput<'/transaction/allRecurring', 'get'>[number];

export type Occurrence = ApiOutput<
    '/transaction/listOccurrences',
    'post'
>['occurrences'][number];

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
