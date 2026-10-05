import { useTransactions } from '../../lib/transactions';
import { Button } from '../common';
import { RecurringTransactionTable } from './RecurringTransactionTable';

export function RecurringTransactionGrid() {
    const { data: txns } = useTransactions({ recurringOnly: true });

    if (!txns) {
        return <p>Loading...</p>;
    }

    const incomes = txns.filter((txn) => txn.amount > 0);
    const expenses = txns.filter((txn) => txn.amount < 0);

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-4'>
                {/* TODO: recurring cost estimations */}
                <div>
                    <span>Weekly</span>
                    <span>Monthly</span>
                    <span>Yearly</span>
                </div>

                <Button className='ml-auto' variant='primary' left='plus'>
                    Add recurrence
                </Button>
            </div>

            <RecurringTransactionTable transactions={incomes} />
            <RecurringTransactionTable transactions={expenses} />
        </div>
    );
}
