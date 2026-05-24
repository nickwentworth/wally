import { useController, UseControllerProps } from 'react-hook-form';
import { TxnFormData } from '../TransactionForm';
import { useState } from 'react';
import { ordinalSuffix } from '../../lib/utils';
import { Button, Icon, Text } from '../common';

export function TxnFormMonthDays(
    props: UseControllerProps<TxnFormData, 'recurrence.daysOfMonth'>,
) {
    const [dayInput, setDayInput] = useState(1);

    const { field } = useController(props);
    const { value, onChange } = field;

    if (!value) {
        return;
    }

    const onAddBtnClick = () => {
        if (!dayInput) {
            return;
        }

        if (!value.includes(dayInput)) {
            onChange([...value, dayInput]);
        }
    };

    const onRemoveBtnClick = (day: number) => {
        onChange(value.filter((d) => d !== day));
    };

    return (
        <div className='flex flex-col items-start gap-2'>
            {value.length > 0 && (
                <div>
                    On the{' '}
                    {value.map((day) => (
                        <button
                            className='bg-cream-400 hover:bg-cream-500 inline-flex items-center gap-1 px-1 py-0.5 rounded-sm mr-1'
                            onClick={() => onRemoveBtnClick(day)}
                            type='button'
                            key={day}
                        >
                            {day}
                            {ordinalSuffix(day)}
                            <Icon icon='close' />
                        </button>
                    ))}
                    day{value.length > 1 && 's'} of the month
                </div>
            )}

            <div className='flex items-center gap-2'>
                <div className='flex items-baseline gap-2'>
                    <Text variant='uppercase'>Add:</Text>
                    <span>On day</span>
                    <input
                        type='number'
                        className='w-14 bg-cream-50 border-cream-400 border rounded-lg p-2 font-semibold'
                        value={dayInput}
                        onChange={(e) =>
                            setDayInput(Number.parseInt(e.target.value))
                        }
                        min={1}
                        max={31}
                    />
                </div>
                <Button variant='primary' onClick={onAddBtnClick}>
                    <Icon icon='plus' />
                </Button>
            </div>
        </div>
    );
}
