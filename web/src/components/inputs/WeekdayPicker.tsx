import { buildClass } from '../../lib/utils';
import { WEEKDAYS } from '../../lib/recurrence';

type WeekdayPickerProps = {
    value: number[];
    onChange: (days: number[]) => void;
};

export function WeekdayPicker(props: WeekdayPickerProps) {
    const buildBtnClass = (idx: number) =>
        buildClass(
            [
                props.value.includes(idx),
                'bg-moss-500 border-moss-500 text-white',
            ],
            [!props.value.includes(idx), 'bg-white border-cream-200'],
            'border w-9 h-9 rounded-full font-semibold',
        );

    const onBtnClick = (idx: number) => {
        props.onChange(
            props.value.includes(idx)
                ? props.value.filter((d) => d !== idx)
                : [...props.value, idx],
        );
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
