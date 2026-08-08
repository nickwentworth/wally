import {
    formatDollar,
    Transaction,
    useTransactionSingleFieldEdits,
} from '../../lib/transactions';
import { Editable } from '../inputs/Editable';
import { Input } from '../inputs/Input';

type TxnTableRowProps = {
    txn: Transaction;
};

export function TxnTableRow(props: TxnTableRowProps) {
    const { updateDate } = useTransactionSingleFieldEdits();

    // TODO: fix backend so this is definitely not null
    const date = props.txn.date?.split('T')[0];
    if (date === undefined) {
        return 'ERROR';
    }

    return (
        <tr className='bg-white'>
            <td className='h-10 w-30 border-cream-200 border-r border-t'>
                <Editable
                    value={date}
                    display={(d) => <p className='px-3'>{d}</p>}
                    input={(d, setD) => (
                        <Input
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
                <p className='px-3'>{formatDollar(props.txn.amount)}</p>
            </td>

            <td className='h-10 border-cream-200 border-t'>
                <p className='px-3'>{props.txn.description}</p>
            </td>
        </tr>
    );
}
