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
import { formatRecurrenceName } from '../../lib/recurrence';
import { Icon } from '../common';

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

    const recurrence = props.txn.recurrence
        ? formatRecurrenceName(props.txn.recurrence)
        : null;

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

            <td className='h-10 border-cream-200 border-t flex items-center'>
                {recurrence && (
                    <span className='bg-cream-100 border border-cream-200 h-6 ml-2 px-2 inline-flex items-center gap-1 rounded-full'>
                        <Icon icon='repeat' size={12} />
                        <span className='text-xs font-semibold'>
                            {recurrence}
                        </span>
                    </span>
                )}
                <Editable
                    value={props.txn.description}
                    display={(desc) => (
                        <p className='px-3 grow self-stretch content-center'>
                            {desc}
                        </p>
                    )}
                    input={(desc, setDesc) => (
                        <Input
                            className='grow'
                            type='text'
                            value={desc ?? ''}
                            onChange={(e) => setDesc(e.target.value)}
                            placeholder='Add a note'
                        />
                    )}
                    onCommit={(desc) =>
                        updateTxn({ description: desc ?? '', id: props.txn.id })
                    }
                />
            </td>
        </tr>
    );
}
