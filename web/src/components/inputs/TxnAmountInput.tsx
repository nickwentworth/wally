import { useState } from 'react';
import { buildClass } from '../../lib/utils';

const MAGNITUDE_RE = /^\d*\.?\d{0,2}$/;

type TxnAmountInputProps = {
    amount: number;
    setAmount: (amt: number) => void;
    size: 'lg' | 'sm';
};

export function TxnAmountInput(props: TxnAmountInputProps) {
    const [magnitude, setMagnitude] = useState(
        props.amount === 0 ? '' : Math.abs(props.amount).toString(),
    );
    const [isExpense, setIsExpense] = useState(props.amount <= 0);

    function updateCaller(mag: string, expense: boolean) {
        const parsed = Number.parseFloat(mag) || 0;
        props.setAmount(expense ? -parsed : parsed);
    }

    const onSignToggle = () => {
        setIsExpense(!isExpense);
        updateCaller(magnitude, !isExpense);
    };

    const onMagnitudeChange = (raw: string) => {
        let value = raw;
        let expense = isExpense;

        if (!MAGNITUDE_RE.test(value)) {
            return;
        }

        setMagnitude(value);
        updateCaller(value, expense);
    };

    const divClass = buildClass(
        'bg-white border-cream-200 border font-mono font-medium rounded-lg overflow-hidden flex',
        [props.size === 'lg', 'text-3xl h-15'],
        [props.size === 'sm', 'text-md h-10'],
    );

    const btnClass = buildClass(
        'bg-cream-100 border-cream-200 border-r shrink-0',
        [props.size === 'lg', 'w-12'],
        [props.size === 'sm', 'w-8'],
    );

    const inputClass = buildClass(
        'w-0 min-w-0 grow pr-2',
        [props.size === 'lg', ''],
        [props.size === 'sm', 'text-right'],
    );

    return (
        <div className={divClass}>
            <button className={btnClass} onClick={onSignToggle} type='button'>
                {isExpense ? <>&ndash;</> : '+'}
            </button>
            <span className='pl-2 pr-1 content-center'>$</span>
            <input
                className={inputClass}
                type='text'
                placeholder='0.00'
                value={magnitude}
                onChange={(e) => onMagnitudeChange(e.target.value)}
            />
        </div>
    );
}
