import {
    calculateTotals,
    formatDollar,
    useTransactions,
} from '../../lib/transactions';
import { todayDateInputStr } from '../../lib/utils';
import { Text } from '../common';
import { Input } from '../inputs/Input';
import { TxnTotalCard } from './TxnTotalCard';

export function TxnTable() {
    const { data: txns } = useTransactions({
        start: '2026-05-01',
        end: todayDateInputStr(),
    });

    if (txns === undefined) {
        return <p>Loading...</p>;
    }

    const totals = calculateTotals(txns);

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-4'>
                <select className='bg-white border-cream-400 border rounded-lg p-2 font-semibold w-40'>
                    <option>This year</option>
                </select>

                <Input
                    className='grow'
                    type='text'
                    placeholder='Search Transactions'
                />
            </div>

            <div className='grid grid-cols-3 gap-4'>
                <TxnTotalCard label='Net Balance' amount={totals.net} />
                <TxnTotalCard label='Income' amount={totals.income} />
                <TxnTotalCard label='Expenses' amount={totals.expense} />
            </div>

            <table className='rounded-lg border-cream-200 border overflow-hidden'>
                <thead>
                    <tr className='bg-cream-100'>
                        <th className='px-3 py-2 border-cream-200 border-r'>
                            <Text variant='uppercase'>Date</Text>
                        </th>
                        <th className='px-3 py-2 border-cream-200 border-r'>
                            <Text variant='uppercase'>Category</Text>
                        </th>
                        <th className='px-3 py-2 border-cream-200 border-r text-right'>
                            <Text variant='uppercase'>Amount</Text>
                        </th>
                        <th className='px-3 py-2'>
                            <Text variant='uppercase'>Description</Text>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {txns.map((txn) => (
                        <tr className='bg-white' key={txn.id}>
                            <td className='h-10 w-30 border-cream-200 border-r border-t'>
                                <p className='px-3'>
                                    {/* TODO: fix backend so this is definitely not null */}
                                    {txn.date?.split('T')[0]}
                                </p>
                            </td>
                            <td className='h-10 w-40 border-cream-200 border-r border-t'>
                                <p className='px-3'>&ndash;</p>
                            </td>
                            <td className='h-10 w-40 border-cream-200 border-r border-t text-right'>
                                <p className='px-3'>
                                    {formatDollar(txn.amount)}
                                </p>
                            </td>
                            <td className='h-10 border-cream-200 border-t'>
                                <p className='px-3'>{txn.description}</p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
