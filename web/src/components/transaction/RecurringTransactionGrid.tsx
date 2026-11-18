import { useRecurringTransactions } from '../../lib/transactions';
import { Button, Loading } from '../common';
import { RecurringTransactionTable } from './RecurringTransactionTable';
import { Totals } from './Totals';
import { useTransactionForm } from './TransactionFormProvider';

export function RecurringTransactionGrid() {
    const { open: openTxnForm } = useTransactionForm();
    const recurringTxnQuery = useRecurringTransactions();

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

            <Totals
                net={recurringTxnQuery.data?.totals.net}
                income={recurringTxnQuery.data?.totals.income}
                expenses={recurringTxnQuery.data?.totals.expenses}
                prefix='Est. Monthly'
            />

            {recurringTxnQuery.isLoading && (
                <div className='flex justify-center items-center gap-1'>
                    <Loading variant='spin' size='md' />
                    Fetching recurrences
                </div>
            )}
            {recurringTxnQuery.isError && (
                <p>{recurringTxnQuery.error.message}</p>
            )}
            {recurringTxnQuery.isSuccess && (
                <>
                    <RecurringTransactionTable
                        transactions={recurringTxnQuery.data.transactions.filter(
                            (txn) => txn.amount > 0,
                        )}
                    />
                    <RecurringTransactionTable
                        transactions={recurringTxnQuery.data.transactions.filter(
                            (txn) => txn.amount < 0,
                        )}
                    />
                </>
            )}
        </div>
    );
}
