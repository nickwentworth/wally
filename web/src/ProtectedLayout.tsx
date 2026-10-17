import { Navigate, Outlet, useOutletContext } from 'react-router';
import { NavBar } from './components/nav/NavBar';
import { useQuery } from '@tanstack/react-query';
import { Dialog, useDialog } from './components/common';
import { apiClient } from './lib/api';

type ProtectedLayoutContext = {
    onAddTransactionClick: () => void;
};

export function ProtectedLayout() {
    const userQuery = useQuery({
        queryFn: async () => {
            const query = await apiClient.GET('/user/me');
            if (!query.response.ok) throw query.error;
            return query.data as any; // TODO: use proper type
        },
        queryKey: ['users'],
    });

    if (userQuery.status === 'pending') {
        return <p>Loading...</p>;
    }
    if (userQuery.status === 'error') {
        return <p>Something went wrong loading your account.</p>;
    }
    if (userQuery.data === null) {
        return <Navigate to='/login' />;
    }

    return (
        <div className='w-dvw h-dvh flex'>
            <NavBar />

            <div className='bg-cream-50 flex flex-col grow'>
                <Outlet />
            </div>
        </div>
    );
}

export function useProtectedLayoutContext() {
    return useOutletContext<ProtectedLayoutContext>();
}
