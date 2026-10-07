import { useCategories } from '../../lib/categories';
import { formatRecurrenceName } from '../../lib/recurrence';
import { formatDollar, Transaction } from '../../lib/transactions';
import { CategoryIcon } from '../category/CategoryIcon';
import { Icon, TableCell, TableRow } from '../common';

type RecurringTransactionRowProps = {
    transaction: Transaction;
};

export function RecurringTransactionRow(props: RecurringTransactionRowProps) {
    const { data: categories } = useCategories();

    const category = categories?.find(
        (cat) => cat.id === props.transaction.categoryId,
    );

    if (!props.transaction.recurrence) {
        throw new Error('ASDF');
    }

    return (
        <TableRow className='hover:bg-cream-100 cursor-pointer group'>
            <TableCell>
                <div className='flex items-center gap-2'>
                    {category ? (
                        <CategoryIcon variant='category' category={category} />
                    ) : (
                        <CategoryIcon variant='empty' />
                    )}

                    <div className='flex flex-col'>
                        <strong>
                            {props.transaction.description || category?.name}
                        </strong>
                        {!!props.transaction.description && (
                            <span>{props.transaction.description}</span>
                        )}
                    </div>
                </div>
            </TableCell>

            <TableCell>
                <div className='flex items-center gap-1.5'>
                    <Icon icon='repeat' />
                    {formatRecurrenceName(props.transaction.recurrence)}
                </div>
            </TableCell>

            <TableCell align='right'>
                {formatDollar(props.transaction.amount)}
            </TableCell>

            <TableCell>
                <Icon
                    icon='chevronRight'
                    className='invisible group-hover:visible'
                />
            </TableCell>
        </TableRow>
    );
}
