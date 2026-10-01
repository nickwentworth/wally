import { useState } from 'react';
import { useTransactions } from '../../lib/transactions';
import { Text } from '../common';
import { Input } from '../inputs/Input';
import { RecurringTransactionCard } from './RecurringTransactionCard';

export function RecurringTransactionGrid() {
    const [search, setSearch] = useState('');
    const { data: txns } = useTransactions({ recurringOnly: true });

    if (!txns) {
        return <p>Loading...</p>;
    }

    const incomes = txns.filter((txn) => txn.amount > 0);
    const expenses = txns.filter((txn) => txn.amount < 0);

    return (
        <div className='flex flex-col gap-4'>
            <Input
                className='w-100'
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search transactions'
            />

            {incomes.length > 0 && (
                <>
                    <Text variant='uppercase'>
                        Income{incomes.length > 1 && 's'} &bull;{' '}
                        {incomes.length}
                    </Text>
                    {/* <div className='grid grid-cols-2'> */}
                    {incomes.map((txn) => (
                        <RecurringTransactionCard
                            key={txn.id}
                            transaction={txn}
                        />
                    ))}
                    {/* </div> */}
                </>
            )}

            {expenses.length > 0 && (
                <>
                    <Text variant='uppercase'>
                        Expense{expenses.length > 1 && 's'} &bull;{' '}
                        {expenses.length}
                    </Text>
                    {/* <div className='grid grid-cols'> */}
                    {expenses.map((txn) => (
                        <RecurringTransactionCard
                            key={txn.id}
                            transaction={txn}
                        />
                    ))}
                    {/* </div> */}
                </>
            )}
        </div>
    );
}
