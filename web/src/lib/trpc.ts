import type { ApiRouter } from 'backend/src/api/router';
import { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';

export const queryClient = new QueryClient();

export const trpc = createTRPCOptionsProxy<ApiRouter>({
    client: createTRPCClient<ApiRouter>({
        links: [
            // TODO: may want to use httpBatchLink instead, look into it
            httpLink({
                // TODO: fetch url/port from config
                url: 'http://localhost:8000/api',
                fetch: (url, options) =>
                    fetch(url, { ...options, credentials: 'include' }),
            }),
        ],
    }),
    queryClient,
});

export type { ApiRouterInputs, ApiRouterOutputs } from 'backend/src/api/router';
