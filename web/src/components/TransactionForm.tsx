import { Button, Icon, Text } from './common';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { ApiRouterInputs, trpc } from '../lib/trpc';

const TXN_RECUR_PERIODS = ['day', 'week', 'month', 'year'] as const;

const TxnFormRecur = z.object({
    rate: z.coerce.number(),
    period: z.enum(TXN_RECUR_PERIODS),
    days: z.number().array().optional(),
    endsAt: z.preprocess(
        (val) => (val === '' ? undefined : val),
        z.coerce.date().optional(),
    ),
});

const TxnFormData = z.object({
    isExpense: z.boolean(),
    amount: z.coerce.number(),
    categoryId: z.coerce.number(),
    date: z.coerce.date(),
    description: z.string().optional(),
    isRecurring: z.boolean(),
    recurrence: TxnFormRecur.optional(),
});
type TxnFormData = z.infer<typeof TxnFormData>;

type TransactionFormProps = {
    onCloseClick: () => void;
};

export function TransactionForm(props: TransactionFormProps) {
    const { register, watch, setValue, handleSubmit } = useForm<TxnFormData>({
        defaultValues: {
            isExpense: true,
            date: new Date(), // FIXME: not currently working
            isRecurring: false,
            recurrence: {
                rate: 1,
                period: 'week',
                days: [1, 2, 3],
            },
        },
    });

    const txnCreator = useMutation(trpc.txn.create.mutationOptions());

    const isExpense = watch('isExpense');
    const isRecurring = watch('isRecurring');

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
                    daysOfWeek: data.recurrence.days ?? [],
                };
                break;
            case 'month':
                recurrence = {
                    ...data.recurrence,
                    period: 'monthly',
                    daysOfMonth: data.recurrence.days ?? [],
                };
                break;
            case 'year':
                recurrence = {
                    ...data.recurrence,
                    period: 'yearly',
                    daysOfYear: data.recurrence.days ?? [],
                };
                break;
        }

        txnCreator.mutate({
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

            <div className='border-cream-400 border text-3xl font-mono font-medium rounded-lg overflow-hidden flex'>
                <button
                    className='w-12 bg-cream-200 border-cream-400 border-r shrink-0'
                    onClick={() => setValue('isExpense', !isExpense)}
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
                    <select
                        className='border-cream-400 border rounded-lg p-2 font-semibold'
                        {...register('categoryId', { required: true })}
                    >
                        <option value={1}>Salary</option>
                    </select>
                </label>

                <label className='flex flex-col gap-2'>
                    <Text variant='uppercase'>Date</Text>
                    <input
                        className='border-cream-400 border rounded-lg p-2 font-semibold'
                        type='date'
                        {...register('date', { required: true })}
                    />
                </label>
            </div>

            <label className='flex flex-col gap-2'>
                <Text variant='uppercase'>Description (optional)</Text>
                <textarea
                    className='border-cream-400 border rounded-lg p-2 resize-y'
                    placeholder='Add a note...'
                    rows={3}
                    {...register('description')}
                ></textarea>
            </label>

            <label className='flex flex-col gap-2'>
                <Text variant='uppercase'>Recurring</Text>
                <div>
                    <input
                        type='checkbox'
                        checked={isRecurring}
                        onChange={(e) =>
                            setValue('isRecurring', e.target.checked)
                        }
                    />
                    Off
                </div>
            </label>

            {isRecurring && (
                <div className='bg-cream-200 border-cream-400 border rounded-lg flex flex-col gap-4 p-4'>
                    <label className='flex flex-col gap-2'>
                        <Text variant='uppercase'>Repeat Every</Text>
                        <div className='flex gap-2'>
                            <input
                                className='bg-cream-50 border-cream-400 border rounded-lg p-2 font-semibold w-16'
                                type='number'
                                {...register('recurrence.rate', {
                                    required: true,
                                })}
                            />
                            <select
                                className='bg-cream-50 border-cream-400 border rounded-lg p-2 font-semibold grow'
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

                    <label className='flex flex-col gap-2'>
                        <Text variant='uppercase'>Repeat on</Text>
                        <div className='flex gap-2'>
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                                // TODO: days of week/month/year, depending on recurrence.period
                                <button className='bg-cream-50 border-cream-400 border w-9 h-9 rounded-full font-semibold'>
                                    {day}
                                </button>
                            ))}
                        </div>
                    </label>

                    <label className='flex flex-col gap-2'>
                        <Text variant='uppercase'>Ends on (optional)</Text>
                        <input
                            className='bg-cream-50 border-cream-400 border rounded-lg p-2 font-semibold'
                            type='date'
                            {...register('recurrence.endsAt')}
                        />
                    </label>
                </div>
            )}

            <div className='flex justify-end gap-2'>
                <Button variant='ghost' onClick={props.onCloseClick}>
                    Cancel
                </Button>
                <Button variant='primary' left='check'>
                    Save
                </Button>
            </div>
        </form>
    );
}
