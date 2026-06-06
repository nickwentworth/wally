import { useState } from 'react';
import { Button, Icon, Text } from '../common';
import { buildClass } from '../../lib/utils';
import { Input } from './Input';
import {
    TXN_FILTER_RANGE_PRESETS,
    TxnFilterRange,
    TxnFilterRangePreset,
} from '../../lib/transactions';
import { useDropdown } from '../../lib/hooks/useDropdown';

const PRESETS_TO_NAMES = {
    today: 'Today',
    week: 'This week',
    month: 'This month',
    year: 'This year',
    all: 'All time',
} satisfies Record<TxnFilterRangePreset, string>;

type TxnRangePickerProps = {
    value: TxnFilterRange;
    onChange: (range: TxnFilterRange) => void;
};

export function TxnRangePicker(props: TxnRangePickerProps) {
    const dropdown = useDropdown();

    const [from, setFrom] = useState(
        typeof props.value === 'object' ? props.value.from : '',
    );
    const [to, setTo] = useState(
        typeof props.value === 'object' ? props.value.to : '',
    );

    const isFromToValid = from && to && new Date(from) <= new Date(to);

    const onApplyBtnClick = () => {
        if (isFromToValid) {
            props.onChange({ from, to });
            dropdown.close();
        }
    };

    let mainLabel;
    if (typeof props.value === 'string') {
        mainLabel = PRESETS_TO_NAMES[props.value];
    } else {
        mainLabel = `${from} to ${to}`;
    }

    return (
        <div className='relative' ref={dropdown.containerRef}>
            <button
                className='w-40 h-10 bg-white border-cream-200 border rounded-lg flex items-center gap-2 p-2'
                onClick={() => dropdown.open()}
                type='button'
            >
                <Icon icon='briefcase' />

                {mainLabel}

                <Icon
                    icon='chevron'
                    className={buildClass('ml-auto transition duration-200', [
                        dropdown.isOpen,
                        'rotate-180',
                    ])}
                />
            </button>

            {dropdown.isOpen && (
                <div
                    className={
                        'absolute top-full left-0 w-100 mt-1 ' +
                        'bg-white border-cream-200 border shadow rounded-lg ' +
                        'flex flex-col p-1'
                    }
                >
                    {TXN_FILTER_RANGE_PRESETS.map((preset) => (
                        <button
                            className='hover:bg-cream-100 rounded flex items-center gap-2 px-3 py-2'
                            onClick={() => {
                                props.onChange(preset);
                                dropdown.close();
                            }}
                            type='button'
                            key={preset}
                        >
                            {PRESETS_TO_NAMES[preset]}
                            {props.value === preset && (
                                <Icon icon='check' className='ml-auto' />
                            )}
                        </button>
                    ))}

                    <hr className='border-cream-200 m-1' />

                    <div className='grid grid-cols-2 gap-2 p-3'>
                        <Text variant='uppercase'>From</Text>
                        <Text variant='uppercase'>To</Text>
                        <Input
                            type='date'
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                        />
                        <Input
                            type='date'
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                        />
                        <Button
                            // TODO: just temporary, eventually add a disabled state
                            variant={isFromToValid ? 'primary' : 'ghost'}
                            className='col-span-2'
                            onClick={onApplyBtnClick}
                        >
                            Apply custom range
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
