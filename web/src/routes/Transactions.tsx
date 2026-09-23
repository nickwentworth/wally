import { useState } from 'react';
import { Button } from '../components/common';
import { Tab, Tabs } from '../components/common/Tabs';
import { TxnTable } from '../components/transaction/TxnTable';
import { useProtectedLayoutContext } from '../ProtectedLayout';

const TXN_TABS = {
    transactions: { label: 'Transactions', icon: 'list' },
    recurring: { label: 'Recurring', icon: 'repeat' },
} satisfies Record<string, Tab>;

type TxnTab = keyof typeof TXN_TABS;

export function Transactions() {
    const { onAddTransactionClick } = useProtectedLayoutContext();
    const [tab, setTab] = useState<TxnTab>('transactions');

    const tabs = {
        transactions: <TxnTable />,
        recurring: <div>TODO: recurring transactions</div>,
    } satisfies Record<TxnTab, React.ReactElement>;

    return (
        <div className='bg-cream-50 flex flex-col grow'>
            <div className='h-20 border-cream-200 border-b flex items-center px-8'>
                <h1 className='mr-auto'>Transactions</h1>
                <Button
                    variant='primary'
                    left='plus'
                    onClick={onAddTransactionClick}
                >
                    Add
                </Button>
            </div>

            <div className='px-8 py-6'>
                {/* TODO: properly handle new user case */}
                {false && (
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
                            onClick={onAddTransactionClick}
                        >
                            Add Transaction
                        </Button>
                    </div>
                )}

                <div className='flex flex-col gap-4'>
                    <Tabs tabs={TXN_TABS} active={tab} onChange={setTab} />

                    {tabs[tab]}
                </div>
            </div>
        </div>
    );
}
