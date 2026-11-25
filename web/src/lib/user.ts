import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiOutput, unwrap } from './api';

export function useUser() {
    return useQuery({
        queryFn: () => unwrap(apiClient.GET('/user/me')),
        queryKey: ['user'],
    });
}

export type User = NonNullable<ApiOutput<'/user/me', 'get'>>;

export function useUserLogout() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: () => unwrap(apiClient.POST('/user/logout')),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['user'] }),
    });
}
