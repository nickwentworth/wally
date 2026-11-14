import z from 'zod';
import {
    RecurringTransaction,
    useTransactionCreate,
    useTransactionUpdate,
} from '../../lib/transactions';
import { useFieldArray, useForm } from 'react-hook-form';
import { todayDateInputStr } from '../../lib/dates';
import { Button, Icon, Text } from '../common';
import {
    TransactionFormEntry,
    TransactionFormEntryData,
} from './TransactionFormEntry';
import { useLens } from '@hookform/lenses';
import { TransactionFormRecurrenceData } from './TransactionFormRecurrence';
import { Recurrence } from '../../lib/recurrence';

const EMPTY_TRANSACTION_FORM_ENTRY = {
    amount: 0,
    categoryId: null,
    date: todayDateInputStr(),
    description: '',
    isRecurring: false,
    recurrence: {
        rate: 1,
        period: 'weekly',
        daysOfWeek: [1],
        daysOfMonth: [],
        daysOfYear: [],
        endsAt: null,
    },
} satisfies TransactionFormEntryData;

const TransactionFormData = z.object({
    transactions: z.array(TransactionFormEntryData).min(1),
});
type TransactionFormData = z.infer<typeof TransactionFormData>;

export type TransactionFormMode =
    | { type: 'create' }
    | { type: 'createRecurring' }
    | { type: 'editRecurring'; transaction: RecurringTransaction };

type TransactionFormProps = TransactionFormMode & {
    onClose: () => void;
    onSubmit: () => void;
};

export function TransactionForm(props: TransactionFormProps) {
    const { control, handleSubmit } = useForm<TransactionFormData>({
        defaultValues: formModeToValues(props),
    });

    const lens = useLens({ control });

    const transactions = useFieldArray({
        control,
        name: 'transactions',
        keyName: '_formId',
    });

    const createTxn = useTransactionCreate({ onSuccess: props.onSubmit });
    const updateTxn = useTransactionUpdate({ onSuccess: props.onSubmit });

    const onSubmit = handleSubmit((raw: any) => {
        const data = TransactionFormData.parse(raw);

        // TODO: allow creating many, currently backend only supports one at a time
        const txn = data.transactions[0];

        if (props.type === 'create' || props.type === 'createRecurring') {
            createTxn.mutate({
                ...txn,
                recurrence: txn.isRecurring
                    ? recurrenceFromFormValues(txn.recurrence)
                    : null,
            });
        } else {
            updateTxn.mutate({
                id: props.transaction.id,
                ...txn,
                recurrence: recurrenceFromFormValues(txn.recurrence),
            });
        }
    });

    return (
        <form className='h-full flex flex-col' onSubmit={onSubmit}>
            <div className='border-cream-200 border-b flex justify-between px-6 py-4'>
                <h2>
                    {props.type === 'create' && 'Add transaction'}
                    {props.type === 'createRecurring' && 'Add recurrence'}
                    {props.type === 'editRecurring' && 'Edit recurrence'}
                </h2>

                <Button variant='ghost' onClick={props.onClose}>
                    <Icon icon='close' />
                </Button>
            </div>

            <div className='grow flex flex-col gap-6 p-6 overflow-auto'>
                <TransactionFormEntry
                    lens={lens.focus('transactions.0')}
                    hideDate={props.type === 'editRecurring'}
                    hideRecurToggle={props.type !== 'create'}
                />

                {transactions.fields.length > 1 && <hr />}

                {transactions.fields.slice(1).map((field, _idx) => {
                    const idx = _idx + 1; // to offset skipping first item
                    return (
                        <div
                            key={field._formId}
                            className='bg-cream-50 border border-cream-200 rounded-lg p-4'
                        >
                            <TransactionFormEntry
                                lens={lens.focus(`transactions.${idx}`)}
                                compact
                                onDelete={() => transactions.remove(idx)}
                            />
                        </div>
                    );
                })}

                {props.type === 'create' && (
                    <Button
                        variant='ghost'
                        className='border-cream-400 border border-dashed mb-auto'
                        left='plus'
                        onClick={() =>
                            transactions.append(EMPTY_TRANSACTION_FORM_ENTRY)
                        }
                    >
                        Add another transaction
                    </Button>
                )}
            </div>

            <div className='border-cream-200 border-t flex items-center gap-2 px-6 py-4'>
                {transactions.fields.length > 1 && (
                    <Text variant='hint'>
                        {transactions.fields.length} transactions
                    </Text>
                )}

                <Button
                    className='ml-auto'
                    variant='ghost'
                    onClick={props.onClose}
                >
                    Cancel
                </Button>

                <Button variant='primary' left='check' type='submit'>
                    Save
                </Button>
            </div>
        </form>
    );
}

function formModeToValues(mode: TransactionFormMode): TransactionFormData {
    switch (mode.type) {
        case 'create':
            return { transactions: [EMPTY_TRANSACTION_FORM_ENTRY] };

        case 'createRecurring':
            return {
                transactions: [
                    { ...EMPTY_TRANSACTION_FORM_ENTRY, isRecurring: true },
                ],
            };

        case 'editRecurring':
            const txn = mode.transaction;

            return {
                transactions: [
                    {
                        amount: txn.amount,
                        categoryId: txn.categoryId,
                        date: txn.startsAt,
                        description: txn.description,
                        isRecurring: true,
                        recurrence: {
                            rate: txn.recurrence.rate,
                            period: txn.recurrence.period,
                            daysOfWeek:
                                txn.recurrence.period === 'weekly'
                                    ? txn.recurrence.daysOfWeek
                                    : [],
                            daysOfMonth:
                                txn.recurrence.period === 'monthly'
                                    ? txn.recurrence.daysOfMonth
                                    : [],
                            daysOfYear:
                                txn.recurrence.period === 'yearly'
                                    ? txn.recurrence.daysOfYear
                                    : [],
                            endsAt: txn.recurrence.endsAt,
                        },
                    },
                ],
            };
    }
}

function recurrenceFromFormValues(
    recurrence: TransactionFormRecurrenceData,
): Recurrence {
    const rate = Number(recurrence.rate);

    switch (recurrence.period) {
        case 'daily':
            return { rate, period: 'daily', endsAt: recurrence.endsAt };

        case 'weekly':
            return {
                rate,
                period: 'weekly',
                daysOfWeek: recurrence.daysOfWeek,
                endsAt: recurrence.endsAt,
            };

        case 'monthly':
            return {
                rate,
                period: 'monthly',
                daysOfMonth: recurrence.daysOfMonth,
                endsAt: recurrence.endsAt,
            };

        case 'yearly':
            return {
                rate,
                period: 'yearly',
                daysOfYear: recurrence.daysOfYear,
                endsAt: recurrence.endsAt,
            };
    }
}
