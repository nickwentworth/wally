import { Transaction } from '../../lib/transactions';
import { Text } from '../common';
import { RecurringTransactionRow } from './RecurringTransactionRow';

type RecurringTransactionTableProps = {
    transactions: Transaction[];
};

export function RecurringTransactionTable(
    props: RecurringTransactionTableProps,
) {
    if (props.transactions.length === 0) {
        return;
    }

    let label = props.transactions[0].amount > 0 ? 'Income' : 'Expense';
    if (props.transactions.length > 1) {
        label += 's';
    }

    return (
        <div className='flex flex-col gap-4'>
            <Text variant='uppercase'>
                {label} &bull; {props.transactions.length}
            </Text>

            <table className='rounded-lg border-cream-200 border'>
                <thead>
                    <tr className='bg-cream-100'>
                        <th className='px-3 py-2'>
                            <Text variant='uppercase'>Name</Text>
                        </th>
                        <th className='px-3 py-2'>
                            <Text variant='uppercase'>Repeats</Text>
                        </th>
                        <th className='px-3 py-2 text-right'>
                            <Text variant='uppercase'>Amount</Text>
                        </th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {props.transactions.map((txn) => (
                        <RecurringTransactionRow
                            key={txn.id}
                            transaction={txn}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
