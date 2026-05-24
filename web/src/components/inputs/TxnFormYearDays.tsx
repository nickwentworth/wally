import { useController, UseControllerProps } from 'react-hook-form';
import { TxnFormData } from '../TransactionForm';
import { useState } from 'react';
import { Button, Icon, Text } from '../common';
import { ordinalSuffix } from '../../lib/utils';

const MONTHS = [
    { month: 'January', days: 31 },
    { month: 'February', days: 29 },
    { month: 'March', days: 31 },
    { month: 'April', days: 30 },
    { month: 'May', days: 31 },
    { month: 'June', days: 30 },
    { month: 'July', days: 31 },
    { month: 'August', days: 31 },
    { month: 'September', days: 30 },
    { month: 'October', days: 31 },
    { month: 'November', days: 30 },
    { month: 'December', days: 31 },
] as const;

type Month = (typeof MONTHS)[number]['month'];

function getDayOfYear(month: Month, dayOfMonth: number) {
    let days = 0;

    for (const m of MONTHS) {
        if (m.month === month) {
            return days + dayOfMonth;
        } else {
            days += m.days;
        }
    }

    throw new Error('Unreachable');
}

function getFormattedMonthAndDay(dayOfYear: number) {
    let monthIdx = 0;
    let dayOfMonth = dayOfYear;

    for (const m of MONTHS) {
        if (dayOfMonth <= m.days) {
            break;
        } else {
            monthIdx += 1;
            dayOfMonth -= m.days;
        }
    }

    const month = MONTHS[monthIdx].month;
    return `${month} ${dayOfMonth}${ordinalSuffix(dayOfMonth)}`;
}

export function TxnFormYearDays(
    props: UseControllerProps<TxnFormData, 'recurrence.daysOfYear'>,
) {
    const [monthInput, setMonthInput] = useState(0);
    const [dayInput, setDayInput] = useState(1);

    const { field } = useController(props);
    const { value, onChange } = field;

    if (!value) {
        return;
    }

    const onAddBtnClick = () => {
        if (monthInput === undefined || dayInput === undefined) {
            console.log;
            return;
        }

        const month = MONTHS[monthInput];
        if (dayInput > month.days) {
            return;
        }

        console.log(month);

        const dayOfYear = getDayOfYear(month.month, dayInput);
        if (!value.includes(dayOfYear)) {
            onChange([...value, dayOfYear]);
        }
    };

    const onRemoveBtnClick = (dayOfYear: number) => {
        onChange(value.filter((d) => d !== dayOfYear));
    };

    return (
        <div className='flex flex-col items-start gap-2'>
            {value.length > 0 && (
                <div className='flex gap-1 flex-wrap'>
                    {value.map((dayOfYear) => (
                        <button
                            className='bg-cream-400 hover:bg-cream-500 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm mr-1'
                            onClick={() => onRemoveBtnClick(dayOfYear)}
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
                        className='bg-cream-50 border-cream-400 border rounded-lg p-2 font-semibold'
                        value={monthInput}
                        onChange={(e) =>
                            setMonthInput(Number.parseInt(e.target.value))
                        }
                    >
                        {MONTHS.map((m, idx) => (
                            <option value={idx}>{m.month}</option>
                        ))}
                    </select>

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
