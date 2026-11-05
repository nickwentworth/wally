import { Transaction } from '../../lib/transactions';
import { Table, TableHeader, TableRow, Text } from '../common';
import { RecurringTransactionRow } from './RecurringTransactionRow';
import { useTransactionForm } from './TransactionFormProvider';

type RecurringTransactionTableProps = {
    transactions: Transaction[];
};

export function RecurringTransactionTable(
    props: RecurringTransactionTableProps,
) {
    const { open: openTxnForm } = useTransactionForm();

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

            <Table variant='rows'>
                <thead>
                    <TableRow>
                        <TableHeader text='Name' />
                        <TableHeader text='Repeats' />
                        <TableHeader align='right' text='Amount' />
                        <TableHeader />
                    </TableRow>
                </thead>

                <tbody>
                    {props.transactions.map((txn) => (
                        <RecurringTransactionRow
                            key={txn.id}
                            transaction={txn}
                            onClick={() =>
                                openTxnForm({
                                    type: 'editRecurring',
                                    transaction: txn,
                                })
                            }
                        />
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
