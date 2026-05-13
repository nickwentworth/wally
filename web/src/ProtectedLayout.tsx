import { Navigate, Outlet } from 'react-router';
import { NavBar } from './components/nav/NavBar';
import { useQuery } from '@tanstack/react-query';
import { trpc } from './lib/trpc';

export function ProtectedLayout() {
    const userQuery = useQuery(trpc.me.queryOptions());

    if (userQuery.status === 'pending') {
        return <p>Loading...</p>;
    }
    if (userQuery.status === 'error') {
        return <p>ERROR: {userQuery.error.message}</p>;
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
