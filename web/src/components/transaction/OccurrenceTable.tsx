import { Occurrence } from '../../lib/occurrences';
import { Loading, Table, TableHeader, TableRow } from '../common';
import { OccurrenceRow } from './OccurrenceRow';

type OccurrenceTableProps = {
    // TODO: more distinct types here, like MaybePending<T>, MaybeError<T>, or Loadable<T> for example
    occurrences?: Occurrence[];
};

export function OccurrenceTable(props: OccurrenceTableProps) {
    if (props.occurrences === undefined) {
        return (
            <div className='flex justify-center items-center gap-1'>
                <Loading variant='spin' size='md' />
                Fetching transactions
            </div>
        );
    }

    return (
        <Table variant='spreadsheet' fixed>
            <thead>
                <TableRow>
                    <TableHeader className='w-35' text='Date' />
                    <TableHeader className='w-40' text='Category' />
                    <TableHeader className='w-40' text='Amount' align='right' />
                    <TableHeader text='Description' />
                </TableRow>
            </thead>

            <tbody>
                {props.occurrences.map((occ) => (
                    <OccurrenceRow
                        occurrence={occ}
                        key={`${occ.transaction.id}_${occ.date}`}
                    />
                ))}
            </tbody>
        </Table>
    );
}
