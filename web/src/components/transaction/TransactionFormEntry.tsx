import { Controller, useWatch } from 'react-hook-form';
import z from 'zod';
import { TxnAmountInput } from '../inputs/TxnAmountInput';
import { Button, Icon, Text } from '../common';
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
    categoryId: z.coerce.number().nullable(),
    date: z.string(),
    description: z.string(),
    isRecurring: z.boolean(),
    recurrence: TransactionFormRecurrenceData,
});
export type TransactionFormEntryData = z.infer<typeof TransactionFormEntryData>;

type TransactionFormEntryProps = {
    lens: Lens<TransactionFormEntryData>;
    variant: 'generic' | 'compact' | 'recurring';
    onDelete?: () => void;
};

export function TransactionFormEntry(props: TransactionFormEntryProps) {
    const isRecurring = useWatch(props.lens.focus('isRecurring').interop());
    const recurrence = useWatch(props.lens.focus('recurrence').interop());

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-2'>
                <div className='grow'>
                    <Controller
                        {...props.lens.focus('amount').interop()}
                        render={({ field }) => (
                            <TxnAmountInput
                                amount={field.value}
                                setAmount={field.onChange}
                                size={props.variant === 'compact' ? 'md' : 'lg'}
                            />
                        )}
                    />
                </div>

                {props.onDelete && (
                    <Button variant='ghost' onClick={props.onDelete}>
                        <Icon icon='close' />
                    </Button>
                )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
                <label className='flex flex-col gap-2'>
                    <Text variant='uppercase'>Category</Text>
                    <Controller
                        {...props.lens.focus('categoryId').interop()}
                        render={({ field }) => (
                            <CategorySelect
                                selectedId={field.value ?? undefined}
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
                    className='resize-none'
                    placeholder='Add a note...'
                    rows={props.variant === 'compact' ? 1 : 3}
                    {...props.lens
                        .focus('description')
                        .interop((ctrl, name) => ctrl.register(name))}
                />
            </label>

            {props.variant !== 'compact' && (
                <label className='flex flex-col gap-2'>
                    <Text variant='uppercase'>Recurring</Text>

                    {props.variant === 'generic' && (
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
                                <span>{formatRecurrenceName(recurrence)}</span>
                            ) : (
                                <span className='text-taupe-400'>Off</span>
                            )}
                        </div>
                    )}

                    {isRecurring && (
                        <TransactionFormRecurrence
                            lens={props.lens.focus('recurrence')}
                        />
                    )}
                </label>
            )}
        </div>
    );
}
