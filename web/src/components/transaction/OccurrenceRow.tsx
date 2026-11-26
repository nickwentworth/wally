import { useCategories } from '../../lib/categories';
import {
    formatDollar,
    Occurrence,
    useOccurrenceUpdate,
} from '../../lib/transactions';
import { CategoryChip } from '../category/CategoryChip';
import { CategorySelect } from '../inputs/CategorySelect';
import { Editable } from '../inputs/Editable';
import { Input } from '../inputs/Input';
import { TxnAmountInput } from '../inputs/TxnAmountInput';
import { Icon, TableCell, TableRow } from '../common';

type OccurrenceRowProps = {
    occurrence: Occurrence;
};

export function OccurrenceRow(props: OccurrenceRowProps) {
    const { mutate: updateOccurrence } = useOccurrenceUpdate();
    const { data: categories } = useCategories();

    const fetchCategory = (categoryId: number | null) => {
        return categories?.find((c) => c.id === categoryId);
    };

    return (
        <TableRow>
            <TableCell>
                <Editable
                    value={props.occurrence.date}
                    display={(d) => <p className='px-3'>{d}</p>}
                    input={(d, setD) => (
                        <Input
                            className='w-full'
                            type='date'
                            value={d}
                            onChange={(e) => setD(e.target.value)}
                        />
                    )}
                    onCommit={(d) =>
                        updateOccurrence({
                            occursOn: props.occurrence.date,
                            id: props.occurrence.id,
                            date: d,
                        })
                    }
                />
            </TableCell>

            <TableCell>
                <Editable
                    value={props.occurrence.categoryId}
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
                        updateOccurrence({
                            occursOn: props.occurrence.date,
                            id: props.occurrence.id,
                            categoryId: catId,
                        })
                    }
                />
            </TableCell>

            <TableCell align='right'>
                <Editable
                    value={props.occurrence.amount}
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
                    onCommit={(amount) =>
                        updateOccurrence({
                            occursOn: props.occurrence.date,
                            id: props.occurrence.id,
                            amount,
                        })
                    }
                />
            </TableCell>

            <TableCell>
                <div className='flex items-center'>
                    {props.occurrence.recurringTransactionId && (
                        <span className='bg-cream-100 border border-cream-200 h-6 ml-3 px-1.5 inline-flex items-center gap-1 rounded-full'>
                            <Icon icon='repeat' size={12} />
                            {/* TODO: add back if we want this? */}
                            {/* <span className='text-xs font-semibold'>
                                {formatRecurrenceName(
                                    props.occurrence.transaction.recurrence,
                                )}
                            </span> */}
                        </span>
                    )}

                    <Editable
                        value={props.occurrence.description}
                        display={(desc) => (
                            <p className='px-3 grow self-stretch content-center'>
                                {desc}
                            </p>
                        )}
                        input={(desc, setDesc) => (
                            <Input
                                className='grow'
                                type='text'
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder='Add a note'
                            />
                        )}
                        onCommit={(desc) =>
                            updateOccurrence({
                                occursOn: props.occurrence.date,
                                id: props.occurrence.id,
                                description: desc,
                            })
                        }
                    />
                </div>
            </TableCell>
        </TableRow>
    );
}
