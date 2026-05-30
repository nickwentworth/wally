import { Button, Icon, Text } from './common';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { ApiRouterInputs } from '../lib/trpc';
import { TxnFormWeekdays } from './inputs/TxnFormWeekdays';
import { TxnFormMonthDays } from './inputs/TxnFormMonthDays';
import { TxnFormYearDays } from './inputs/TxnFormYearDays';
import { Toggle } from './inputs/Toggle';
import { formatRecurrenceName } from '../lib/recurrence';
import { useTransactionCreate } from '../lib/transactions';
import { CategorySelect } from './inputs/CategorySelect';
import { Input } from './inputs/Input';
import { todayDateInputStr } from '../lib/utils';

const TXN_RECUR_PERIODS = ['day', 'week', 'month', 'year'] as const;

const TxnFormRecur = z.object({
    rate: z.coerce.number(),
    period: z.enum(TXN_RECUR_PERIODS),
    daysOfWeek: z.number().array(),
    daysOfMonth: z.number().array(),
    daysOfYear: z.number().array(),
    endsAt: z.preprocess(
        (val) => (val === '' ? undefined : val),
        z.string().optional(),
    ),
});
export type TxnFormRecur = z.infer<typeof TxnFormRecur>;

const TxnFormData = z.object({
    isExpense: z.boolean(),
    amount: z.coerce.number(),
    categoryId: z.coerce.number().optional(),
    date: z.string(),
    description: z.string().optional(),
    isRecurring: z.boolean(),
    recurrence: TxnFormRecur.optional(),
});
export type TxnFormData = z.infer<typeof TxnFormData>;

type TransactionFormProps = {
    onCloseClick: () => void;
    onSubmit: () => void;
};

export function TransactionForm(props: TransactionFormProps) {
    const { register, watch, control, setValue, handleSubmit } =
        useForm<TxnFormData>({
            defaultValues: {
                isExpense: true,
                date: todayDateInputStr(),
                isRecurring: false,
                recurrence: {
                    rate: 1,
                    period: 'week',
                    daysOfWeek: [],
                    daysOfMonth: [],
                    daysOfYear: [],
                },
            },
        });

    const createTxn = useTransactionCreate({ onSuccess: props.onSubmit });

    const isExpense = watch('isExpense');
    const categoryId = watch('categoryId');
    const isRecurring = watch('isRecurring');
    const recurrence = watch('recurrence');
    const recurPeriod = watch('recurrence.period');

    const onSubmit = handleSubmit((raw: any) => {
        const data = TxnFormData.parse({
            ...raw,
            recurrence: raw.isRecurring ? raw.recurrence : undefined,
        });

        let recurrence: ApiRouterInputs['txn']['create']['recurrence'];
        switch (data.recurrence?.period) {
            case undefined:
                recurrence = undefined;
                break;
            case 'day':
                recurrence = { ...data.recurrence, period: 'daily' };
                break;
            case 'week':
                recurrence = {
                    ...data.recurrence,
                    period: 'weekly',
                    daysOfWeek: data.recurrence.daysOfWeek ?? [],
                };
                break;
            case 'month':
                recurrence = {
                    ...data.recurrence,
                    period: 'monthly',
                    daysOfMonth: data.recurrence.daysOfMonth ?? [],
                };
                break;
            case 'year':
                recurrence = {
                    ...data.recurrence,
                    period: 'yearly',
                    daysOfYear: data.recurrence.daysOfYear ?? [],
                };
                break;
        }

        createTxn.mutate({
            ...data,
            amount: data.isExpense ? -data.amount : data.amount,
            recurrence,
        });
    });

    return (
        <form className='flex flex-col gap-4 p-6' onSubmit={onSubmit}>
            <div className='flex justify-between'>
                <h2>Add Transaction</h2>
                <Button variant='ghost' onClick={props.onCloseClick}>
                    <Icon icon='close' />
                </Button>
            </div>

            <div className='bg-white border-cream-200 border text-3xl font-mono font-medium rounded-lg overflow-hidden flex'>
                <button
                    className='w-12 bg-cream-100 border-cream-200 border-r shrink-0'
                    onClick={() => setValue('isExpense', !isExpense)}
                    type='button'
                >
                    {isExpense ? <>&ndash;</> : '+'}
                </button>
                <span className='pl-2 pr-1 py-3'>$</span>
                <input
                    className='min-w-0 grow pr-2'
                    type='text'
                    placeholder='0.00'
                    {...register('amount', { required: true })}
                />
            </div>

            <div className='grid grid-cols-2 gap-4'>
                <label className='flex flex-col gap-2'>
                    <Text variant='uppercase'>Category</Text>
                    <CategorySelect
                        selectedId={categoryId}
                        onSelect={(c) => setValue('categoryId', c.id)}
                    />
                </label>

                <label className='flex flex-col gap-2'>
                    <Text variant='uppercase'>Date</Text>
                    <Input
                        type='date'
                        {...register('date', { required: true })}
                    />
                </label>
            </div>

            <label className='flex flex-col gap-2'>
                <Text variant='uppercase'>Description (optional)</Text>
                <Input
                    variant='textarea'
                    placeholder='Add a note...'
                    rows={3}
                    {...register('description')}
                />
            </label>

            <label className='flex flex-col gap-2'>
                <Text variant='uppercase'>Recurring</Text>
                <div className='flex items-center gap-2'>
                    <Toggle
                        isToggled={isRecurring}
                        onToggle={(b) => setValue('isRecurring', b)}
                    />
                    {isRecurring && recurrence ? (
                        <b>{formatRecurrenceName(recurrence)}</b>
                    ) : (
                        <span className='text-taupe-400'>Off</span>
                    )}
                </div>
            </label>

            {isRecurring && (
                <div className='bg-cream-100 border-cream-200 border rounded-lg flex flex-col gap-4 p-4'>
                    <label className='flex flex-col gap-2'>
                        <Text variant='uppercase'>Repeat Every</Text>
                        <div className='flex gap-2'>
                            <Input
                                className='w-16'
                                type='number'
                                {...register('recurrence.rate', {
                                    required: true,
                                })}
                            />

                            <select
                                className='bg-white border-cream-200 border rounded-lg h-10 p-2 grow'
                                {...register('recurrence.period')}
                            >
                                {TXN_RECUR_PERIODS.map((period) => (
                                    <option value={period} key={period}>
                                        {period}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </label>

                    {recurPeriod !== 'day' && (
                        <div className='flex flex-col gap-2'>
                            <Text variant='uppercase'>Repeat on</Text>
                            {recurPeriod === 'week' && (
                                <TxnFormWeekdays
                                    control={control}
                                    name='recurrence.daysOfWeek'
                                />
                            )}
                            {recurPeriod === 'month' && (
                                <TxnFormMonthDays
                                    control={control}
                                    name='recurrence.daysOfMonth'
                                />
                            )}
                            {recurPeriod === 'year' && (
                                <TxnFormYearDays
                                    control={control}
                                    name='recurrence.daysOfYear'
                                />
                            )}
                        </div>
                    )}

                    <label className='flex flex-col gap-2'>
                        <Text variant='uppercase'>Ends on (optional)</Text>
                        <Input type='date' {...register('recurrence.endsAt')} />
                    </label>
                </div>
            )}

            <div className='flex justify-end gap-2'>
                <Button variant='ghost' onClick={props.onCloseClick}>
                    Cancel
                </Button>
                <Button variant='primary' left='check' type='submit'>
                    Save
                </Button>
            </div>
        </form>
    );
}
