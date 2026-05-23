import { Navigate, Outlet, useOutletContext } from 'react-router';
import { NavBar } from './components/nav/NavBar';
import { useQuery } from '@tanstack/react-query';
import { trpc } from './lib/trpc';
import { TransactionForm } from './components/TransactionForm';
import { Modal, useModal } from './components/common';

type ProtectedLayoutContext = {
    onAddTransactionClick: () => void;
};

export function ProtectedLayout() {
    const transactionFormControls = useModal();

    const userQuery = useQuery(trpc.user.me.queryOptions());

    if (userQuery.status === 'pending') {
        return <p>Loading...</p>;
    }
    if (userQuery.status === 'error') {
        return <p>ERROR: {userQuery.error.message}</p>;
    }
    if (userQuery.data === null) {
        return <Navigate to='/login' />;
    }

    const outletContext = {
        onAddTransactionClick: transactionFormControls.open,
    } satisfies ProtectedLayoutContext;

    return (
        <div className='w-dvw h-dvh flex'>
            <NavBar onAddTransactionClick={transactionFormControls.open} />

            <div className='bg-cream-50 flex flex-col grow'>
                <Outlet context={outletContext} />
            </div>

            <Modal controls={transactionFormControls}>
                <TransactionForm onCloseClick={transactionFormControls.close} />
            </Modal>
        </div>
    );
}

export function useProtectedLayoutContext() {
    return useOutletContext<ProtectedLayoutContext>();
}
