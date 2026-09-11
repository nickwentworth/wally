import { useCategories } from '../../lib/categories';
import {
    formatDollar,
    Transaction,
    useTransactionUpdate,
} from '../../lib/transactions';
import { CategoryIcon } from '../category/CategoryIcon';
import { CategoryChip } from '../category/CategoryChip';
import { CategorySelect } from '../inputs/CategorySelect';
import { Editable } from '../inputs/Editable';
import { Input } from '../inputs/Input';
import { TxnAmountInput } from '../inputs/TxnAmountInput';

type TxnTableRowProps = {
    txn: Transaction;
};

export function TxnTableRow(props: TxnTableRowProps) {
    const { mutate: updateTxn } = useTransactionUpdate();
    const { data: categories } = useCategories();

    // TODO: fix backend so this is definitely not null
    const date = props.txn.date?.split('T')[0];
    if (date === undefined) {
        return 'ERROR';
    }

    const fetchCategory = (categoryId: number | null) => {
        return categories?.find((c) => c.id === categoryId);
    };

    return (
        <tr className='bg-white'>
            <td className='h-10 border-cream-200 border-r border-t'>
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
                        updateTxn({ date: d, id: props.txn.id });
                    }}
                />
            </td>

            <td className='h-10 border-cream-200 border-r border-t'>
                <Editable
                    value={props.txn.categoryId}
                    display={(catId) => {
                        const category = fetchCategory(catId);
                        return category ? (
                            <div className='px-2'>
                                <CategoryChip category={category} />
                            </div>
                        ) : (
                            <p className='px-3'>&ndash;</p>
                        );
                    }}
                    input={(catId, setCatId) => (
                        <CategorySelect
                            selectedId={catId ?? undefined}
                            onSelect={(category) => {
                                setCatId(category.id);
                                (document.activeElement as HTMLElement)?.blur();
                            }}
                        />
                    )}
                    onCommit={(catId) =>
                        updateTxn({ categoryId: catId, id: props.txn.id })
                    }
                />
            </td>

            <td className='h-10 border-cream-200 border-r border-t text-right'>
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
                        updateTxn({ amount: amt, id: props.txn.id });
                    }}
                />
            </td>

            <td className='h-10 border-cream-200 border-t'>
                <p className='px-3'>{props.txn.description}</p>
            </td>
        </tr>
    );
}
