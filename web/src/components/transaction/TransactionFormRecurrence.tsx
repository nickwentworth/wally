import { Lens } from '@hookform/lenses';
import z from 'zod';
import { Text } from '../common';
import { Input } from '../inputs/Input';
import { Controller, useWatch } from 'react-hook-form';
import { WeekdayPicker } from '../inputs/WeekdayPicker';
import { MonthDayPicker } from '../inputs/MonthDayPicker';
import { YearDayPicker } from '../inputs/YearDayPicker';

const TXN_RECUR_PERIODS = ['daily', 'weekly', 'monthly', 'yearly'] as const;

export const TransactionFormRecurrenceData = z.object({
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
export type TransactionFormRecurrenceData = z.infer<
    typeof TransactionFormRecurrenceData
>;

type TransactionFormRecurrenceProps = {
    lens: Lens<TransactionFormRecurrenceData>;
};

export function TransactionFormRecurrence(
    props: TransactionFormRecurrenceProps,
) {
    const period = useWatch(props.lens.focus('period').interop());

    return (
        <div className='bg-cream-100 border-cream-200 border rounded-lg flex flex-col gap-4 p-4'>
            <label className='flex flex-col gap-2'>
                <Text variant='uppercase'>Repeat Every</Text>
                <div className='flex gap-2'>
                    <Input
                        className='w-16'
                        type='number'
                        min={1}
                        {...props.lens
                            .focus('rate')
                            .interop((ctrl, name) =>
                                ctrl.register(name, { required: true, min: 1 }),
                            )}
                    />

                    <select
                        className='bg-white border-cream-200 border rounded-lg h-10 p-2 grow'
                        {...props.lens
                            .focus('period')
                            .interop((ctrl, name) => ctrl.register(name))}
                    >
                        {TXN_RECUR_PERIODS.map((period) => (
                            <option value={period} key={period}>
                                {period}
                            </option>
                        ))}
                    </select>
                </div>
            </label>

            {period !== 'daily' && (
                <div className='flex flex-col gap-2'>
                    <Text variant='uppercase'>Repeat on</Text>

                    {period === 'weekly' && (
                        <Controller
                            {...props.lens.focus('daysOfWeek').interop()}
                            render={({ field }) => (
                                <WeekdayPicker
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    )}

                    {period === 'monthly' && (
                        <Controller
                            {...props.lens.focus('daysOfMonth').interop()}
                            render={({ field }) => (
                                <MonthDayPicker
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    )}

                    {period === 'yearly' && (
                        <Controller
                            {...props.lens.focus('daysOfYear').interop()}
                            render={({ field }) => (
                                <YearDayPicker
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    )}
                </div>
            )}

            <label className='flex flex-col gap-2'>
                <Text variant='uppercase'>Ends on (optional)</Text>
                <Input
                    type='date'
                    {...props.lens
                        .focus('endsAt')
                        .interop((ctrl, name) => ctrl.register(name))}
                />
            </label>
        </div>
    );
}
