import { useRecurringTransactions } from '../../lib/transactions';
import { Button } from '../common';
import { RecurringTransactionTable } from './RecurringTransactionTable';
import { useTransactionForm } from './TransactionFormProvider';

export function RecurringTransactionGrid() {
    const { open: openTxnForm } = useTransactionForm();
    const { data: txns } = useRecurringTransactions();

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

                <Button
                    className='ml-auto'
                    variant='primary'
                    left='plus'
                    onClick={() => openTxnForm({ type: 'createRecurring' })}
                >
                    Add recurrence
                </Button>
            </div>

            <RecurringTransactionTable transactions={incomes} />
            <RecurringTransactionTable transactions={expenses} />
        </div>
    );
}
