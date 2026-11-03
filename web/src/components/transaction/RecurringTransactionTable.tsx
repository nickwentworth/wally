import { useState } from 'react';
import { Transaction } from '../../lib/transactions';
import {
    Dialog,
    Table,
    TableHeader,
    TableRow,
    Text,
    useDialog,
} from '../common';
import { RecurringTransactionRow } from './RecurringTransactionRow';
import { TransactionForm } from './TransactionForm';

type RecurringTransactionTableProps = {
    transactions: Transaction[];
};

export function RecurringTransactionTable(
    props: RecurringTransactionTableProps,
) {
    const [focusedTxn, setFocusedTxn] = useState<Transaction>();
    const txnFormDialog = useDialog();

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
                            onClick={() => {
                                setFocusedTxn(txn);
                                txnFormDialog.open();
                            }}
                        />
                    ))}
                </tbody>
            </Table>

            <Dialog controls={txnFormDialog} placement='right'>
                <TransactionForm
                    transaction={focusedTxn}
                    onClose={txnFormDialog.close}
                    onSubmit={txnFormDialog.close}
                />
            </Dialog>
        </div>
    );
}
