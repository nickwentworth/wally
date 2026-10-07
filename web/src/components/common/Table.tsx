import { buildClass } from '../../lib/utils';
import { Text } from './Text';
import { createContext, useContext } from 'react';

/* ———————————————————— ———————————————————— */

type TableProps = React.PropsWithChildren<{
    variant: 'rows' | 'spreadsheet';
    fixed?: boolean;
}>;

const TableContext = createContext<TableProps['variant']>('rows');

export function Table(props: TableProps) {
    return (
        <TableContext.Provider value={props.variant}>
            <div className='border-cream-200 border rounded-lg overflow-hidden'>
                <table
                    className={buildClass('w-full', [
                        !!props.fixed,
                        'table-fixed',
                    ])}
                >
                    {props.children}
                </table>
            </div>
        </TableContext.Provider>
    );
}

/* ———————————————————— ———————————————————— */

type TableRowProps = React.ComponentProps<'tr'>;

export function TableRow(props: TableRowProps) {
    const { className, ...rest } = props;

    return <tr className={buildClass('bg-white', className)} {...rest} />;
}

/* ———————————————————— ———————————————————— */

type TableHeaderProps = {
    text?: string;
    className?: string;
    align?: 'left' | 'center' | 'right';
};

export function TableHeader(props: TableHeaderProps) {
    const variant = useContext(TableContext);

    return (
        <th
            className={buildClass(
                'bg-cream-100 border-cream-200 px-3 py-1.5',
                [props.align === 'left', 'text-left'],
                [props.align === 'center', 'text-center'],
                [props.align === 'right', 'text-right'],
                [variant === 'spreadsheet', 'not-last:border-r'],
                props.className,
            )}
        >
            {props.text && <Text variant='uppercase'>{props.text}</Text>}
        </th>
    );
}

/* ———————————————————— ———————————————————— */

type TableCellProps = React.PropsWithChildren<{
    align?: 'left' | 'center' | 'right';
    colSpan?: number;
    className?: string;
}>;

export function TableCell(props: TableCellProps) {
    const variant = useContext(TableContext);

    return (
        <td
            className={buildClass(
                'border-cream-200 border-t',
                [props.align === 'left', 'text-left'],
                [props.align === 'center', 'text-center'],
                [props.align === 'right', 'text-right'],
                [variant === 'rows', 'px-3 py-2'],
                [variant === 'spreadsheet', 'h-10 not-last:border-r'],
                props.className,
            )}
            colSpan={props.colSpan}
        >
            {props.children}
        </td>
    );
}
