import { Button } from '../components/common';
import { TxnPage } from '../components/transaction/TxnPage';
import { useProtectedLayoutContext } from '../ProtectedLayout';

export function Transactions() {
    const { onAddTransactionClick } = useProtectedLayoutContext();

    return (
        <div className='bg-cream-50 flex flex-col grow'>
            <div className='h-20 border-cream-200 border-b flex items-center px-8'>
                <h1 className='mr-auto'>Transactions</h1>
                <Button
                    variant='primary'
                    left='plus'
                    onClick={onAddTransactionClick}
                >
                    Add
                </Button>
            </div>

            <div className='px-8 py-6'>
                <TxnPage onAddTransactionClick={onAddTransactionClick} />
            </div>
        </div>
    );
}
