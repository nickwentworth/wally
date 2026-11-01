import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiInput, ApiOutput, unwrap } from './api';
import { transactionKey } from './transactions';

/* -------------------- Hooks -------------------- */

export const occurrenceKey = ['occurrence'];

export function useOccurrences(opts: ApiInput<'/occurrence/list', 'post'>) {
    return useQuery({
        queryFn: () =>
            unwrap(apiClient.POST('/occurrence/list', { body: opts })),
        queryKey: [...occurrenceKey, 'list', opts],
    });
}

export function useOccurrenceUpdate() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (input: ApiInput<'/occurrence/update', 'post'>) =>
            unwrap(apiClient.POST('/occurrence/update', { body: input })),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: transactionKey });
            qc.invalidateQueries({ queryKey: occurrenceKey });
        },
    });
}

/* -------------------- Types / Constants -------------------- */

export type Occurrence = ApiOutput<
    '/occurrence/list',
    'post'
>['occurrences'][number];
