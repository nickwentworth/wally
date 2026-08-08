import { useState } from 'react';
import {
    calculateTotals,
    formatDollar,
    getTxnFilterRange,
    TxnFilterRange,
    useTransactions,
} from '../../lib/transactions';
import { Text } from '../common';
import { Input } from '../inputs/Input';
import { TxnRangePicker } from '../inputs/TxnRangePicker';
import { TxnTotalCard } from './TxnTotalCard';
import { Editable } from '../inputs/Editable';
import { TxnTableRow } from './TxnTableRow';

type TxnTableFilter = {
    range: TxnFilterRange;
    categoryIds: number[];
    search: string;
};

export function TxnTable() {
    const [filters, setFilters] = useState<TxnTableFilter>({
        range: 'year',
        categoryIds: [],
        search: '',
    });

    const { start, end } = getTxnFilterRange(filters.range);

    const { data: txns } = useTransactions({ start, end });

    if (txns === undefined) {
        return <p>Loading...</p>;
    }

    const totals = calculateTotals(txns);

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-4'>
                <TxnRangePicker
                    value={filters.range}
                    onChange={(range) => setFilters({ ...filters, range })}
                />

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
                        <TxnTableRow txn={txn} key={`${txn.id}_${txn.date}`} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
