import z from 'zod';
import { Transaction, useTransactionCreate } from '../../lib/transactions';
import { useFieldArray, useForm } from 'react-hook-form';
import { todayDateInputStr } from '../../lib/dates';
import { Button, Icon } from '../common';
import {
    TransactionFormEntry,
    TransactionFormEntryData,
} from './TransactionFormEntry';
import { useLens } from '@hookform/lenses';
import { ApiRouterInputs } from 'backend/src/api/router';
import { TransactionFormRecurrenceData } from './TransactionFormRecurrence';

const EMPTY_TRANSACTION_FORM_ENTRY = {
    amount: 0,
    categoryId: undefined,
    date: todayDateInputStr(),
    description: '',
    isRecurring: false,
    recurrence: {
        rate: 1,
        period: 'monthly',
        daysOfMonth: [],
        daysOfWeek: [],
        daysOfYear: [],
    },
} satisfies TransactionFormEntryData;

function txnFormRecurToCreate(
    r: TransactionFormRecurrenceData,
): NonNullable<ApiRouterInputs['transaction']['create']['recurrence']> {
    const rate = Number(r.rate);

    switch (r.period) {
        case 'daily':
            return { rate, period: 'daily', endsAt: r.endsAt };

        case 'weekly':
            return {
                rate,
                period: 'weekly',
                daysOfWeek: r.daysOfWeek,
                endsAt: r.endsAt,
            };

        case 'monthly':
            return {
                rate,
                period: 'monthly',
                daysOfMonth: r.daysOfMonth,
                endsAt: r.endsAt,
            };

        case 'yearly':
            return {
                rate,
                period: 'yearly',
                daysOfYear: r.daysOfYear,
                endsAt: r.endsAt,
            };
    }
}

const TransactionFormData = z.object({
    transactions: z.array(TransactionFormEntryData).min(1),
});
type TransactionFormData = z.infer<typeof TransactionFormData>;

type TransactionFormProps = {
    transaction?: Transaction;
    onClose: () => void;
    onSubmit: () => void;
};

export function TransactionForm(props: TransactionFormProps) {
    const { control, handleSubmit } = useForm<TransactionFormData>({
        defaultValues: {
            transactions: [
                props.transaction
                    ? {
                          // TODO: form data, the endpoint, and the DB schema need to be reviewed
                          amount: props.transaction.amount,
                          categoryId: props.transaction.categoryId ?? undefined,
                          date: props.transaction.date!,
                          description:
                              props.transaction.description ?? undefined,
                          isRecurring: !!props.transaction?.recurrence,
                      }
                    : EMPTY_TRANSACTION_FORM_ENTRY,
            ],
        },
    });

    const lens = useLens({ control });

    const transactions = useFieldArray({
        control,
        name: 'transactions',
        keyName: '_formId',
    });

    const createTxn = useTransactionCreate({ onSuccess: props.onSubmit });

    const onSubmit = handleSubmit((raw: any) => {
        const data = TransactionFormData.parse(raw);

        // TODO: allow creating many, currently backend only supports one at a time
        const txn = data.transactions[0];

        const recurrence = txn.isRecurring
            ? txnFormRecurToCreate(txn.recurrence)
            : undefined;

        createTxn.mutate({
            ...txn,
            recurrence,
        });
    });

    return (
        <form className='flex flex-col gap-6 p-6' onSubmit={onSubmit}>
            <div className='flex justify-between'>
                <h2>{props.transaction ? 'Edit' : 'Add'} Transaction</h2>
                <Button variant='ghost' onClick={props.onClose}>
                    <Icon icon='close' />
                </Button>
            </div>

            {transactions.fields.flatMap((field, idx) => [
                idx > 0 && <hr key={field._formId + 'hr'} />,
                <TransactionFormEntry
                    key={field._formId}
                    lens={lens.focus(`transactions.${idx}`)}
                />,
            ])}

            <Button
                variant='ghost'
                className='border-cream-400 border border-dashed'
                left='plus'
                onClick={() =>
                    transactions.append(EMPTY_TRANSACTION_FORM_ENTRY)
                }
            >
                Add another transaction
            </Button>

            <div className='flex justify-end gap-2'>
                <Button variant='ghost' onClick={props.onClose}>
                    Cancel
                </Button>
                <Button variant='primary' left='check' type='submit'>
                    Save
                </Button>
            </div>
        </form>
    );
}
