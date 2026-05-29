import { formatDollar } from '../../lib/transactions';
import { Text } from '../common';

type TxnTotalCardProps = {
    label: string;
    amount: number;
};

export function TxnTotalCard(props: TxnTotalCardProps) {
    return (
        <div className='bg-white border-cream-200 border rounded-lg flex flex-col gap-2 p-4'>
            <Text variant='uppercase'>{props.label}</Text>
            <p className='text-3xl'>{formatDollar(props.amount)}</p>
        </div>
    );
}
