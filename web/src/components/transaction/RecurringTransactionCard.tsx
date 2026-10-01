import { useCategories } from '../../lib/categories';
import { formatRecurrenceName } from '../../lib/recurrence';
import { formatDollar, Transaction } from '../../lib/transactions';
import { CategoryIcon } from '../category/CategoryIcon';
import { Icon } from '../common';

type RecurringTransactionCardProps = {
    transaction: Transaction;
};

export function RecurringTransactionCard(props: RecurringTransactionCardProps) {
    if (!props.transaction.recurrence) {
        return 'ERROR!';
    }

    const { data: categories } = useCategories();
    const category = categories?.find(
        (c) => c.id === props.transaction.categoryId,
    );

    if (!category) {
        return '...';
    }

    return (
        <div className='bg-white border border-cream-200 rounded-lg flex flex-col gap-3 p-4 cursor-pointer hover:shadow-md'>
            <div className='flex items-center gap-2'>
                <CategoryIcon
                    variant='category'
                    category={category}
                    size='lg'
                />
                <div className='grow flex flex-col'>
                    <span className='font-medium'>
                        {props.transaction.description}
                    </span>
                    <span className='text-taupe-400'>{category.name}</span>
                </div>
                <span className='text-lg'>
                    {formatDollar(props.transaction.amount)}
                </span>
            </div>

            <hr />

            <div className='text-taupe-500 flex items-center gap-2'>
                <Icon icon='repeat' />
                {formatRecurrenceName(props.transaction.recurrence)}
            </div>
        </div>
    );
}
