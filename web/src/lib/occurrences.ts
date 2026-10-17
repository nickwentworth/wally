import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiInput } from './api';

/* -------------------- Hooks -------------------- */

export const occurrenceKey = ['occurrence'];

export function useOccurrences(opts: ApiInput<'/occurrence/list', 'post'>) {
    return useQuery({
        queryFn: async () => {
            const query = await apiClient.POST('/occurrence/list', {
                body: opts,
            });
            if (!query.response.ok) throw query.error;
            return query.data as any; // TODO: use proper type
        },
        queryKey: [...occurrenceKey, 'list', opts],
    });
}

/* -------------------- Types / Constants -------------------- */

export type Occurrence = any; // TODO: ApiOutput<'/occurrence/list', 'post'>[number];
