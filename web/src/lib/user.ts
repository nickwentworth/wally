import { useQuery } from '@tanstack/react-query';
import { apiClient, unwrap } from './api';

export function useUser() {
    return useQuery({
        queryFn: () => unwrap(apiClient.GET('/user/me')),
        queryKey: ['user'],
    });
}
