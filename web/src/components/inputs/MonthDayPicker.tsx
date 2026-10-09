import { useState } from 'react';
import { ordinalSuffix } from '../../lib/utils';
import { Button, Icon, Text } from '../common';
import { Input } from './Input';

type MonthDayPickerProps = {
    value: number[];
    onChange: (days: number[]) => void;
};

export function MonthDayPicker(props: MonthDayPickerProps) {
    const [dayInput, setDayInput] = useState(1);

    const addDay = () => {
        if (!dayInput) {
            return;
        }

        if (!props.value.includes(dayInput)) {
            props.onChange([...props.value, dayInput]);
        }
    };

    const removeDay = (day: number) => {
        props.onChange(props.value.filter((d) => d !== day));
    };

    return (
        <div className='flex flex-col items-start gap-2'>
            {props.value.length > 0 && (
                <div>
                    On the{' '}
                    {props.value.map((day) => (
                        <button
                            className='bg-cream-200 hover:bg-cream-300 inline-flex items-center gap-1 px-1 py-0.5 rounded-sm mr-1'
                            onClick={() => removeDay(day)}
                            type='button'
                            key={day}
                        >
                            {day}
                            {ordinalSuffix(day)}
                            <Icon icon='close' />
                        </button>
                    ))}
                    day{props.value.length > 1 && 's'} of the month
                </div>
            )}

            <div className='flex items-center gap-2'>
                <div className='flex items-baseline gap-2'>
                    <Text variant='uppercase'>Add:</Text>
                    <span>On day</span>
                    <Input
                        type='number'
                        className='w-14'
                        value={dayInput}
                        onChange={(e) =>
                            setDayInput(Number.parseInt(e.target.value))
                        }
                        min={1}
                        max={31}
                    />
                </div>

                <Button variant='primary' onClick={addDay}>
                    <Icon icon='plus' />
                </Button>
            </div>
        </div>
    );
}
