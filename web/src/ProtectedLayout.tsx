import { Navigate, Outlet } from 'react-router';
import { NavBar } from './components/nav/NavBar';
import { User, useUser } from './lib/user';
import { createContext, useContext } from 'react';
import { Loading } from './components/common/Loading';

const AuthedUserContext = createContext<User | null>(null);

export function ProtectedLayout() {
    const userQuery = useUser();

    if (userQuery.status === 'pending') {
        return (
            <div className='w-dvw h-dvh bg-cream-50 flex items-center justify-center gap-1'>
                <Loading variant='spin' size='md' />
                <span>Loading</span>
            </div>
        );
    }

    if (userQuery.status === 'error') {
        return (
            <div className='w-dvw h-dvh bg-cream-50 flex flex-col items-center justify-center gap-1'>
                <span>Something went wrong loading your account.</span>
                <span>{userQuery.error.message}</span>
            </div>
        );
    }

    if (userQuery.data === null) {
        return <Navigate to='/login' />;
    }

    return (
        <AuthedUserContext value={userQuery.data}>
            <div className='w-dvw h-dvh bg-cream-50 flex'>
                <NavBar />

                <div className='grow'>
                    <Outlet />
                </div>
            </div>
        </AuthedUserContext>
    );
}

export function useAuthedUser() {
    const user = useContext(AuthedUserContext);
    if (!user) {
        throw new Error(
            'useAuthedUser must be called by a child of ProtectedLayout',
        );
    }
    return user;
}
