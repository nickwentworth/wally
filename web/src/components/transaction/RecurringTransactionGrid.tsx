import { useState } from 'react';
import { useRecurringTransactions } from '../../lib/transactions';
import { Button, Loading } from '../common';
import { RecurringTransactionTable } from './RecurringTransactionTable';
import { Totals } from './Totals';
import { useTransactionForm } from './TransactionFormProvider';
import { Tab, Tabs } from '../common/Tabs';
import {
    endOfMonthInputStr,
    endOfWeekInputStr,
    endOfYearInputStr,
    startOfMonthInputStr,
    startOfWeekInputStr,
    startOfYearInputStr,
} from '../../lib/dates';

const RECURRENCE_PERIODS = {
    week: { label: 'Weekly' },
    month: { label: 'Monthly' },
    year: { label: 'Yearly' },
} satisfies Record<string, Tab>;
type RecurrencePeriod = keyof typeof RECURRENCE_PERIODS;

function resolvePeriodRange(period: RecurrencePeriod) {
    switch (period) {
        case 'week':
            return { from: startOfWeekInputStr(), to: endOfWeekInputStr() };
        case 'month':
            return { from: startOfMonthInputStr(), to: endOfMonthInputStr() };
        case 'year':
            return { from: startOfYearInputStr(), to: endOfYearInputStr() };
    }
}

export function RecurringTransactionGrid() {
    const { open: openTxnForm } = useTransactionForm();

    const [period, setPeriod] = useState<RecurrencePeriod>('month');
    const { from, to } = resolvePeriodRange(period);

    const recurringTxnQuery = useRecurringTransactions({ from, to });

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-4'>
                <Tabs
                    tabs={RECURRENCE_PERIODS}
                    active={period}
                    onChange={setPeriod}
                    variant='segmented'
                />

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
                prefix={`Est. ${RECURRENCE_PERIODS[period].label}`}
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
