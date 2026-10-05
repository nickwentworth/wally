import { useCategories } from '../../lib/categories';
import { formatRecurrenceName } from '../../lib/recurrence';
import { formatDollar, Transaction } from '../../lib/transactions';
import { CategoryIcon } from '../category/CategoryIcon';
import { Icon } from '../common';

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
        <tr className='bg-white hover:bg-cream-100 cursor-pointer group'>
            <td className='border-cream-200 border-t p-3 py-3'>
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
            </td>

            <td className='border-cream-200 border-t px-3 py-2'>
                <div className='flex items-center gap-1.5'>
                    <Icon icon='repeat' />
                    {formatRecurrenceName(props.transaction.recurrence)}
                </div>
            </td>

            <td className='border-cream-200 border-t px-3 py-2 text-right'>
                {formatDollar(props.transaction.amount)}
            </td>

            <td className='border-cream-200 border-t px-3 py-2'>
                <Icon
                    icon='chevronRight'
                    className='invisible group-hover:visible'
                />
            </td>
        </tr>
    );
}
