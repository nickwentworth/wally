import {
    formatDollar,
    Transaction,
    useTransactionSingleFieldEdits,
} from '../../lib/transactions';
import { Editable } from '../inputs/Editable';
import { Input } from '../inputs/Input';
import { TxnAmountInput } from '../inputs/TxnAmountInput';

type TxnTableRowProps = {
    txn: Transaction;
};

export function TxnTableRow(props: TxnTableRowProps) {
    const { updateDate, updateAmount } = useTransactionSingleFieldEdits();

    // TODO: fix backend so this is definitely not null
    const date = props.txn.date?.split('T')[0];
    if (date === undefined) {
        return 'ERROR';
    }

    return (
        <tr className='bg-white'>
            <td className='h-10 w-40 border-cream-200 border-r border-t'>
                <Editable
                    value={date}
                    display={(d) => <p className='px-3'>{d}</p>}
                    input={(d, setD) => (
                        <Input
                            className='w-full'
                            type='date'
                            value={d}
                            onChange={(e) => setD(e.target.value)}
                        />
                    )}
                    onCommit={(d) => {
                        updateDate.mutate({ date: d, id: props.txn.id });
                    }}
                />
            </td>

            <td className='h-10 w-40 border-cream-200 border-r border-t'>
                <p className='px-3'>&ndash;</p>
            </td>

            <td className='h-10 w-40 border-cream-200 border-r border-t text-right'>
                <Editable
                    value={props.txn.amount}
                    display={(amt) => (
                        <p className='px-3'>{formatDollar(amt)}</p>
                    )}
                    input={(amt, setAmt) => (
                        <TxnAmountInput
                            amount={amt}
                            setAmount={setAmt}
                            size='sm'
                        />
                    )}
                    onCommit={(amt) => {
                        updateAmount.mutate({ amount: amt, id: props.txn.id });
                    }}
                />
            </td>

            <td className='h-10 border-cream-200 border-t'>
                <p className='px-3'>{props.txn.description}</p>
            </td>
        </tr>
    );
}
