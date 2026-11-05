import { createContext, useContext, useState } from 'react';
import { TransactionForm, TransactionFormMode } from './TransactionForm';
import { Dialog, useDialog } from '../common';

type TransactionFormContext = {
    open: (mode: TransactionFormMode) => void;
};

const TransactionFormContext = createContext<TransactionFormContext | null>(
    null,
);

export function TransactionFormProvider(props: React.PropsWithChildren) {
    const dialog = useDialog();
    const [mode, setMode] = useState<TransactionFormMode>({ type: 'create' });

    // Incremented version, for easy remounts whenever form mode changes
    const [version, setVersion] = useState(0);

    const ctx = {
        open: (next) => {
            setMode(next);
            setVersion((v) => v + 1);
            dialog.open();
        },
    } satisfies TransactionFormContext;

    return (
        <TransactionFormContext value={ctx}>
            {props.children}

            <Dialog controls={dialog} placement='right'>
                <TransactionForm
                    key={version}
                    {...mode}
                    onClose={dialog.close}
                    onSubmit={dialog.close}
                />
            </Dialog>
        </TransactionFormContext>
    );
}

export function useTransactionForm() {
    const ctx = useContext(TransactionFormContext);
    if (!ctx) {
        throw new Error(
            'useTransactionForm must be called by a child of TransactionFormProvider',
        );
    }
    return ctx;
}
