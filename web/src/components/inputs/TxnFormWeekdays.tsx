import { useController, UseControllerProps } from 'react-hook-form';
import { TxnFormData } from '../TransactionForm';
import { buildClass } from '../../lib/utils';
import { WEEKDAYS } from '../../lib/recurrence';

export function TxnFormWeekdays(
    props: UseControllerProps<TxnFormData, 'recurrence.daysOfWeek'>,
) {
    const { field } = useController(props);
    const { value, onChange } = field;

    if (value === undefined) {
        return;
    }

    const buildBtnClass = (idx: number) =>
        buildClass(
            [value.includes(idx), 'bg-moss-500 border-moss-500 text-white'],
            [!value.includes(idx), 'bg-white border-cream-200'],
            'border w-9 h-9 rounded-full font-semibold',
        );

    const onBtnClick = (idx: number) => {
        if (!value.includes(idx)) {
            onChange([...value, idx]);
        } else {
            onChange(value.filter((d) => d !== idx));
        }
    };

    return (
        <div className='flex gap-2'>
            {WEEKDAYS.map((day, dayIdx) => (
                <button
                    className={buildBtnClass(dayIdx)}
                    onClick={() => onBtnClick(dayIdx)}
                    type='button'
                    key={dayIdx}
                >
                    {day.charAt(0)}
                </button>
            ))}
        </div>
    );
}
