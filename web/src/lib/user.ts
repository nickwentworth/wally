import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiOutput, unwrap } from './api';

export function useUser() {
    return useQuery({
        queryFn: () => unwrap(apiClient.GET('/user/me')),
        queryKey: ['user'],
    });
}

export type User = NonNullable<ApiOutput<'/user/me', 'get'>>;
