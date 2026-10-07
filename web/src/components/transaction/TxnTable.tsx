import { useState } from 'react';

import { Button, Table, TableHeader, TableRow, Text } from '../common';
import { DateRangePicker } from '../inputs/DateRangePicker';
import { TxnTableRow } from './TxnTableRow';
import { TxnSearchBar } from '../inputs/TxnSearchBar';
import { DateRange, resolveDateRange } from '../../lib/dates';
import { useOccurrences } from '../../lib/occurrences';
import { formatDollar } from '../../lib/transactions';

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

    let totalPrefix = '';
    switch (filters.range) {
        case 'today':
            totalPrefix = 'Daily ';
            break;
        case 'week':
            totalPrefix = 'Weekly ';
            break;
        case 'month':
            totalPrefix = 'Monthly ';
            break;
        case 'year':
            totalPrefix = 'Yearly ';
            break;
        case 'all':
            totalPrefix = 'All-Time ';
            break;
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

                <Button className='shrink-0' variant='primary' left='plus'>
                    Add transaction
                </Button>
            </div>

            <div className='grid grid-cols-3 gap-4'>
                <div className='bg-white border-cream-200 border rounded-lg flex flex-col gap-1 p-4'>
                    <Text variant='uppercase'>{totalPrefix}Net</Text>
                    <p className='text-3xl'>{formatDollar(data.totals.net)}</p>
                </div>

                <div className='bg-white border-cream-200 border col-span-2 rounded-lg grid grid-cols-2'>
                    <div className='border-cream-200 border-r flex flex-col gap-1 p-4'>
                        <Text variant='uppercase'>{totalPrefix}Income</Text>
                        <p className='text-3xl'>
                            {formatDollar(data.totals.income)}
                        </p>
                    </div>
                    <div className='p-4 flex flex-col gap-1'>
                        <Text variant='uppercase'>{totalPrefix}Expenses</Text>
                        <p className='text-3xl'>
                            {formatDollar(data.totals.expenses)}
                        </p>
                    </div>
                </div>
            </div>

            <Table variant='spreadsheet' fixed>
                <thead>
                    <TableRow>
                        <TableHeader className='w-35' text='Date' />
                        <TableHeader className='w-40' text='Category' />
                        <TableHeader
                            className='w-40'
                            text='Amount'
                            align='right'
                        />
                        <TableHeader text='Description' />
                    </TableRow>
                </thead>

                <tbody>
                    {data.occurrences.map((occ) => (
                        <TxnTableRow
                            occurrence={occ}
                            key={`${occ.transactionId}_${occ.date}`}
                        />
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
