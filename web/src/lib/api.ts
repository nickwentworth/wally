import createFetchClient from 'openapi-fetch';
import type { paths } from './api-schema';

export const apiClient = createFetchClient<paths>({
    baseUrl: 'http://localhost:8000/api/',
    credentials: 'include',
});

type ApiOp<P extends keyof paths, M extends keyof paths[P]> = paths[P][M];

export type ApiOutput<P extends keyof paths, M extends keyof paths[P]> =
    ApiOp<P, M> extends {
        responses: { 200: { content: { 'application/json': infer T } } };
    }
        ? T
        : never;

export type ApiInput<P extends keyof paths, M extends keyof paths[P]> =
    ApiOp<P, M> extends {
        requestBody?: { content: { 'application/json': infer T } };
    }
        ? T
        : never;
