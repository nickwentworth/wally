import { useState } from 'react';
import { Button, Dialog, useDialog } from '../common';
import { DateRangePicker } from '../inputs/DateRangePicker';
import { TxnSearchBar } from '../inputs/TxnSearchBar';
import { DateRange, resolveDateRange } from '../../lib/dates';
import { useOccurrences } from '../../lib/occurrences';
import { TransactionForm } from './TransactionForm';
import { OccurrenceTable } from './OccurrenceTable';
import { Totals } from './Totals';

type OccurrenceGridFilter = {
    range: DateRange;
    categoryIds: number[];
    search: string;
};

export function OccurrenceGrid() {
    const txnFormDialog = useDialog();

    const [filters, setFilters] = useState<OccurrenceGridFilter>({
        range: 'year',
        categoryIds: [],
        search: '',
    });

    const { from, to } = resolveDateRange(filters.range);

    const occurrenceQuery = useOccurrences({
        from,
        to,
        categoryIds: filters.categoryIds,
        search: filters.search,
    });

    let totalPrefix = '';
    switch (filters.range) {
        case 'today':
            totalPrefix = 'Daily';
            break;
        case 'week':
            totalPrefix = 'Weekly';
            break;
        case 'month':
            totalPrefix = 'Monthly';
            break;
        case 'year':
            totalPrefix = 'Yearly';
            break;
        case 'all':
            totalPrefix = 'All-Time';
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

                <Button
                    className='shrink-0'
                    variant='primary'
                    left='plus'
                    onClick={txnFormDialog.open}
                >
                    Add transaction
                </Button>
            </div>

            {occurrenceQuery.isError ? (
                <p>{occurrenceQuery.error.message}</p>
            ) : (
                <>
                    <Totals
                        net={occurrenceQuery.data?.totals.net}
                        income={occurrenceQuery.data?.totals.income}
                        expenses={occurrenceQuery.data?.totals.expenses}
                        prefix={totalPrefix}
                    />
                    <OccurrenceTable
                        occurrences={occurrenceQuery.data?.occurrences}
                    />
                </>
            )}

            <Dialog controls={txnFormDialog} placement='right'>
                <TransactionForm
                    onClose={txnFormDialog.close}
                    onSubmit={txnFormDialog.close}
                />
            </Dialog>
        </div>
    );
}
