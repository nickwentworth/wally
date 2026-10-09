import { useState } from 'react';
import { Button, Icon, Text } from '../common';
import {
    getDayOfYear,
    getFormattedMonthAndDay,
    MONTHS,
} from '../../lib/recurrence';
import { Input } from './Input';

type YearDayPickerProps = {
    value: number[];
    onChange: (days: number[]) => void;
};

export function YearDayPicker(props: YearDayPickerProps) {
    const [monthInput, setMonthInput] = useState(0);
    const [dayInput, setDayInput] = useState(1);

    const addDay = () => {
        if (!dayInput) {
            return;
        }

        const month = MONTHS[monthInput];
        if (dayInput > month.days) {
            return;
        }

        const dayOfYear = getDayOfYear(month.month, dayInput);
        if (!props.value.includes(dayOfYear)) {
            props.onChange([...props.value, dayOfYear]);
        }
    };

    const removeDay = (dayOfYear: number) => {
        props.onChange(props.value.filter((d) => d !== dayOfYear));
    };

    return (
        <div className='flex flex-col items-start gap-2'>
            {props.value.length > 0 && (
                <div className='flex gap-1 flex-wrap'>
                    {props.value.map((dayOfYear) => (
                        <button
                            className='bg-cream-200 hover:bg-cream-300 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm mr-1'
                            onClick={() => removeDay(dayOfYear)}
                            type='button'
                            key={dayOfYear}
                        >
                            {getFormattedMonthAndDay(dayOfYear)}
                            <Icon icon='close' />
                        </button>
                    ))}
                </div>
            )}

            <div className='flex items-center gap-2'>
                <div className='flex items-baseline gap-2'>
                    <Text variant='uppercase'>Add:</Text>
                    <span>On</span>

                    <select
                        className='bg-white border-cream-200 border rounded-lg p-2'
                        value={monthInput}
                        onChange={(e) =>
                            setMonthInput(Number.parseInt(e.target.value))
                        }
                    >
                        {MONTHS.map((m, idx) => (
                            <option value={idx}>{m.month}</option>
                        ))}
                    </select>

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
