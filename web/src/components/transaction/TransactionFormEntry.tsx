import { Controller, useWatch } from 'react-hook-form';
import z from 'zod';
import { TxnAmountInput } from '../inputs/TxnAmountInput';
import { Text } from '../common';
import { CategorySelect } from '../inputs/CategorySelect';
import { Input } from '../inputs/Input';
import { Toggle } from '../inputs/Toggle';
import { Lens } from '@hookform/lenses';
import {
    TransactionFormRecurrence,
    TransactionFormRecurrenceData,
} from './TransactionFormRecurrence';
import { formatRecurrenceName } from '../../lib/recurrence';

export const TransactionFormEntryData = z.object({
    amount: z.coerce.number(),
    categoryId: z.coerce.number().optional(),
    date: z.string(),
    description: z.string(),
    isRecurring: z.boolean(),
    recurrence: TransactionFormRecurrenceData,
});
export type TransactionFormEntryData = z.infer<typeof TransactionFormEntryData>;

type TransactionFormEntryProps = {
    lens: Lens<TransactionFormEntryData>;
};

export function TransactionFormEntry(props: TransactionFormEntryProps) {
    const isRecurring = useWatch(props.lens.focus('isRecurring').interop());
    const recurrence = useWatch(props.lens.focus('recurrence').interop());

    return (
        <div className='flex flex-col gap-4'>
            <Controller
                {...props.lens.focus('amount').interop()}
                render={({ field }) => (
                    <TxnAmountInput
                        amount={field.value}
                        setAmount={field.onChange}
                        size='lg'
                    />
                )}
            />

            <div className='grid grid-cols-2 gap-4'>
                <label className='flex flex-col gap-2'>
                    <Text variant='uppercase'>Category</Text>
                    <Controller
                        {...props.lens.focus('categoryId').interop()}
                        render={({ field }) => (
                            <CategorySelect
                                selectedId={field.value}
                                onSelect={(cat) => field.onChange(cat.id)}
                            />
                        )}
                    />
                </label>

                <label className='flex flex-col gap-2'>
                    <Text variant='uppercase'>Date</Text>
                    <Input
                        type='date'
                        {...props.lens
                            .focus('date')
                            .interop((ctrl, name) =>
                                ctrl.register(name, { required: true }),
                            )}
                    />
                </label>
            </div>

            <label className='flex flex-col gap-2'>
                <Text variant='uppercase'>Description (optional)</Text>
                <Input
                    variant='textarea'
                    placeholder='Add a note...'
                    rows={3}
                    {...props.lens
                        .focus('description')
                        .interop((ctrl, name) => ctrl.register(name))}
                />
            </label>

            <label className='flex flex-col gap-2'>
                <Text variant='uppercase'>Recurring</Text>
                <div className='flex items-center gap-2'>
                    <Controller
                        {...props.lens.focus('isRecurring').interop()}
                        render={({ field }) => (
                            <Toggle
                                isToggled={field.value}
                                onToggle={field.onChange}
                            />
                        )}
                    />

                    {isRecurring ? (
                        <b>{formatRecurrenceName(recurrence)}</b>
                    ) : (
                        <span className='text-taupe-400'>Off</span>
                    )}
                </div>
            </label>

            {isRecurring && (
                <TransactionFormRecurrence
                    lens={props.lens.focus('recurrence')}
                />
            )}

            {/* {isRecurring && (
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
                    )} */}
        </div>
    );
}
