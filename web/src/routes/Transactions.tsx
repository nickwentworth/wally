import { Button } from '../components/Button';

export function Transactions() {
    return (
        <div className='bg-cream-50 flex flex-col grow'>
            <div className='border-cream-200 border-b flex items-center px-8 py-6'>
                <h1 className='mr-auto'>Transactions</h1>
                <Button variant='primary' left='plus'>
                    Add
                </Button>
            </div>

            <div className='px-8 py-6'>
                <div className='border-cream-200 border rounded-lg flex flex-col items-center gap-4 py-16'>
                    <p>(Receipt Image)</p>
                    <h2 className='font-display text-4xl text-taupe-900'>
                        Welcome to Wally!
                    </h2>
                    <p className='text-taupe-500'>
                        Basically a spreadshet. A really good one though.
                    </p>
                    <Button variant='primary' left='plus'>
                        Add Transaction
                    </Button>
                </div>
            </div>
        </div>
    );
}
