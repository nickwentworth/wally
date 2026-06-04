import { useState } from 'react';
import { useTransactions } from '../../lib/transactions';
import { Button } from '../common';
import { TxnTable } from './TxnTable';

type TxnPageTab = 'transactions' | 'recurring';

type TxnPageProps = {
    onAddTransactionClick: () => void;
};

export function TxnPage(props: TxnPageProps) {
    const [tab, setTab] = useState<TxnPageTab>('transactions');

    // const { data: txns } = useTransactions();

    // if (txns === undefined) {
    //     return <p>Loading...</p>;
    // }

    // if (txns.length === 0) {
    if (false) {
        return (
            <div className='border-cream-200 border rounded-lg flex flex-col items-center gap-4 py-16'>
                <p>(Receipt Image)</p>
                <h2 className='font-display text-4xl text-taupe-900'>
                    Welcome to Wally!
                </h2>
                <p className='text-taupe-500'>
                    Basically a spreadshet. A really good one though.
                </p>
                <Button
                    variant='primary'
                    left='plus'
                    onClick={props.onAddTransactionClick}
                >
                    Add Transaction
                </Button>
            </div>
        );
    }

    const tabs = {
        transactions: <TxnTable />,
        recurring: 'TODO: Recurring Transactions Table',
    } satisfies Record<TxnPageTab, React.ReactNode>;

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-4'>
                <Button
                    variant={tab === 'transactions' ? 'primary' : 'ghost'}
                    onClick={() => setTab('transactions')}
                >
                    Transactions
                </Button>
                <Button
                    variant={tab === 'recurring' ? 'primary' : 'ghost'}
                    onClick={() => setTab('recurring')}
                >
                    Recurring
                </Button>
            </div>

            {tabs[tab]}
        </div>
    );
}
