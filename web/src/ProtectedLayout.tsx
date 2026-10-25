import { Navigate, Outlet, useOutletContext } from 'react-router';
import { NavBar } from './components/nav/NavBar';
import { useUser } from './lib/user';

type ProtectedLayoutContext = {
    onAddTransactionClick: () => void;
};

export function ProtectedLayout() {
    const userQuery = useUser();

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
