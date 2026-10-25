import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiInput, ApiOutput, unwrap } from './api';

/* -------------------- Hooks -------------------- */

export const occurrenceKey = ['occurrence'];

export function useOccurrences(opts: ApiInput<'/occurrence/list', 'post'>) {
    return useQuery({
        queryFn: () =>
            unwrap(apiClient.POST('/occurrence/list', { body: opts })),
        queryKey: [...occurrenceKey, 'list', opts],
    });
}

/* -------------------- Types / Constants -------------------- */

export type Occurrence = ApiOutput<
    '/occurrence/list',
    'post'
>['occurrences'][number];
