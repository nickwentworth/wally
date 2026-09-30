import { useState } from 'react';

import { Text } from '../common';
import { DateRangePicker } from '../inputs/DateRangePicker';
import { TxnTotalCard } from './TxnTotalCard';
import { TxnTableRow } from './TxnTableRow';
import { TxnSearchBar } from '../inputs/TxnSearchBar';
import { DateRange, resolveDateRange } from '../../lib/dates';
import { useOccurrences } from '../../lib/occurrences';

type TxnTableFilter = {
    range: DateRange;
    categoryIds: number[];
    search: string;
};

export function TxnTable() {
    const [filters, setFilters] = useState<TxnTableFilter>({
        range: 'year',
        categoryIds: [],
        search: '',
    });

    const { from, to } = resolveDateRange(filters.range);

    const { data } = useOccurrences({
        from,
        to,
        categoryIds: filters.categoryIds,
        search: filters.search,
    });

    if (data === undefined) {
        return <p>Loading...</p>;
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-4'>
                <DateRangePicker
                    value={filters.range}
                    onChange={(range) => setFilters({ ...filters, range })}
                />

                <TxnSearchBar
                    categoryIds={filters.categoryIds}
                    onCategoryIdsChange={(ids) =>
                        setFilters({ ...filters, categoryIds: ids })
                    }
                    search={filters.search}
                    onSearchChange={(search) =>
                        setFilters({ ...filters, search })
                    }
                />
            </div>

            <div className='grid grid-cols-3 gap-4'>
                <TxnTotalCard label='Net Balance' amount={data.totals.net} />
                <TxnTotalCard label='Income' amount={data.totals.income} />
                <TxnTotalCard label='Expenses' amount={data.totals.expenses} />
            </div>

            <table className='table-fixed w-full rounded-lg border-cream-200 border'>
                <thead>
                    <tr className='bg-cream-100'>
                        <th className='w-35 px-3 py-2 border-cream-200 border-r'>
                            <Text variant='uppercase'>Date</Text>
                        </th>
                        <th className='w-40 px-3 py-2 border-cream-200 border-r'>
                            <Text variant='uppercase'>Category</Text>
                        </th>
                        <th className='w-40 px-3 py-2 border-cream-200 border-r text-right'>
                            <Text variant='uppercase'>Amount</Text>
                        </th>
                        <th className='px-3 py-2'>
                            <Text variant='uppercase'>Description</Text>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {data.occurrences.map((occ) => (
                        <TxnTableRow
                            occurrence={occ}
                            key={`${occ.transactionId}_${occ.date}`}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
