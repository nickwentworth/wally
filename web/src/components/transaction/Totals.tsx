import { formatDollar } from '../../lib/transactions';
import { Loading, Text } from '../common';

type TotalsProps = {
    // TODO: more distinct types here, like MaybePending<T>, MaybeError<T>, or Loadable<T> for example
    net?: number;
    income?: number;
    expenses?: number;
    prefix?: string;
};

export function Totals(props: TotalsProps) {
    return (
        <div className='grid grid-cols-3 gap-4'>
            <div className='bg-white border-cream-200 border rounded-lg flex flex-col gap-1 p-4'>
                <Text variant='uppercase'>{props.prefix ?? ''} Net</Text>
                <p className='text-3xl h-lh'>
                    {props.net !== undefined ? (
                        formatDollar(props.net)
                    ) : (
                        <Loading variant='spin' size='lg' />
                    )}
                </p>
            </div>

            <div className='bg-white border-cream-200 border col-span-2 rounded-lg grid grid-cols-2'>
                <div className='border-cream-200 border-r flex flex-col gap-1 p-4'>
                    <Text variant='uppercase'>{props.prefix ?? ''} Income</Text>
                    <p className='text-3xl h-lh'>
                        {props.income !== undefined ? (
                            formatDollar(props.income)
                        ) : (
                            <Loading variant='spin' size='lg' />
                        )}
                    </p>
                </div>
                <div className='p-4 flex flex-col gap-1'>
                    <Text variant='uppercase'>
                        {props.prefix ?? ''} Expenses
                    </Text>
                    <p className='text-3xl h-lh'>
                        {props.expenses !== undefined ? (
                            formatDollar(props.expenses)
                        ) : (
                            <Loading variant='spin' size='lg' />
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
