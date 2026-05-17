import { Button } from './Button';
import { Icon } from './Icon';

type TransactionFormProps = {
    onCloseClick: () => void;
};

export function TransactionForm(props: TransactionFormProps) {
    return (
        <div className='flex flex-col gap-4 p-6'>
            <div className='flex justify-between'>
                <h2>Add Transaction</h2>
                <Button variant='primary' onClick={props.onCloseClick}>
                    <Icon icon='close' />
                </Button>
            </div>

            <div className='border-cream-400 border rounded-lg overflow-hidden flex'>
                <button className='bg-cream-200 border-cream-400 border-r text-2xl font-bold px-4'>
                    &ndash;
                </button>
                <div className='grow text-3xl font-mono font-medium flex gap-1 px-2 py-3'>
                    $
                    <input type='text' placeholder='0.00' />
                </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
                <label className='flex flex-col gap-2'>
                    <span className='text-taupe-400 text-xs font-semibold tracking-wider'>
                        CATEGORY
                    </span>
                    <select className='border-cream-400 border rounded-lg p-2 font-semibold'>
                        <option>Salary</option>
                    </select>
                </label>

                <label className='flex flex-col gap-2'>
                    DATE
                    <input
                        className='border-cream-400 border rounded-lg p-2 font-semibold'
                        type='date'
                    />
                </label>
            </div>

            <label className='flex flex-col gap-2'>
                DECSRIPTION (OPTIONAL)
                <textarea
                    className='border-cream-400 border rounded-lg p-2 resize-y'
                    placeholder='Add a note...'
                    rows={3}
                ></textarea>
            </label>

            <label className='flex flex-col gap-2'>
                RECURRING
                <div>
                    <input type='checkbox' /> Off
                </div>
            </label>

            <div className='flex justify-end gap-2'>
                <Button variant='primary' onClick={props.onCloseClick}>
                    Cancel
                </Button>
                <Button variant='primary' left='check'>
                    Save
                </Button>
            </div>
        </div>
    );
}
