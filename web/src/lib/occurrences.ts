import { useQuery } from '@tanstack/react-query';
import { ApiRouterInputs, ApiRouterOutputs, trpc } from './trpc';

/* -------------------- Hooks -------------------- */

export function useOccurrences(opts: ApiRouterInputs['occurrence']['list']) {
    return useQuery(trpc.occurrence.list.queryOptions(opts));
}

/* -------------------- Types / Constants -------------------- */

export type Occurrence =
    ApiRouterOutputs['occurrence']['list']['occurrences'][number];
