import createFetchClient from 'openapi-fetch';
import type { paths } from './api-schema';

export const apiClient = createFetchClient<paths>({
    baseUrl: 'http://localhost:8000/api/',
    credentials: 'include',
});

export async function unwrap<T>(
    request: Promise<{ data?: T; error?: unknown; response: Response }>,
): Promise<T> {
    const { data, error, response } = await request;
    if (!response.ok) {
        throw new Error(
            `API error ${response.status} from ${response.url}: ${error}`,
        );
    } else {
        // Safe to cast, openapi-fetch will always return non-undefined data if 2xx
        return data as Exclude<T, undefined>;
    }
}

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
