import { useState } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { Text } from './Text';

type TransactionFormProps = {
    onCloseClick: () => void;
};

export function TransactionForm(props: TransactionFormProps) {
    const [isExpense, setIsExpense] = useState(true);
    const [isRecurring, setIsRecurring] = useState(false);

    return (
        <div className='flex flex-col gap-4 p-6'>
            <div className='flex justify-between'>
                <h2>Add Transaction</h2>
                <Button variant='ghost' onClick={props.onCloseClick}>
                    <Icon icon='close' />
                </Button>
            </div>

            <div className='border-cream-400 border text-3xl font-mono font-medium rounded-lg overflow-hidden flex'>
                <button
                    className='w-12 bg-cream-200 border-cream-400 border-r shrink-0'
                    onClick={() => setIsExpense((b) => !b)}
                >
                    {isExpense ? '+' : <>&ndash;</>}
                </button>
                <span className='pl-2 pr-1 py-3'>$</span>
                <input
                    className='min-w-0 grow pr-2'
                    type='text'
                    placeholder='0.00'
                />
            </div>

            <div className='grid grid-cols-2 gap-4'>
                <label className='flex flex-col gap-2'>
                    <Text variant='uppercase'>Category</Text>
                    <select className='border-cream-400 border rounded-lg p-2 font-semibold'>
                        <option>Salary</option>
                    </select>
                </label>

                <label className='flex flex-col gap-2'>
                    <Text variant='uppercase'>Date</Text>
                    <input
                        className='border-cream-400 border rounded-lg p-2 font-semibold'
                        type='date'
                    />
                </label>
            </div>

            <label className='flex flex-col gap-2'>
                <Text variant='uppercase'>Description (optional)</Text>
                <textarea
                    className='border-cream-400 border rounded-lg p-2 resize-y'
                    placeholder='Add a note...'
                    rows={3}
                ></textarea>
            </label>

            <label className='flex flex-col gap-2'>
                <Text variant='uppercase'>Recurring</Text>
                <div>
                    <input
                        type='checkbox'
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                    />
                    Off
                </div>
            </label>

            {isRecurring && (
                <div className='bg-cream-200 border-cream-400 border rounded-lg flex flex-col gap-4 p-4'>
                    <label className='flex flex-col gap-2'>
                        <Text variant='uppercase'>Repeat Every</Text>
                        <div className='flex gap-2'>
                            <input
                                className='bg-cream-50 border-cream-400 border rounded-lg p-2 font-semibold w-16'
                                type='number'
                            />
                            <select className='bg-cream-50 border-cream-400 border rounded-lg p-2 font-semibold grow'>
                                <option>week</option>
                            </select>
                        </div>
                    </label>

                    <label className='flex flex-col gap-2'>
                        <Text variant='uppercase'>Repeat on</Text>
                        <div className='flex gap-2'>
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                                <button className='bg-cream-50 border-cream-400 border w-9 h-9 rounded-full font-semibold'>
                                    {day}
                                </button>
                            ))}
                        </div>
                    </label>

                    <label className='flex flex-col gap-2'>
                        <Text variant='uppercase'>Ends on (optional)</Text>
                        <input
                            className='bg-cream-50 border-cream-400 border rounded-lg p-2 font-semibold'
                            type='date'
                        />
                    </label>
                </div>
            )}

            <div className='flex justify-end gap-2'>
                <Button variant='ghost' onClick={props.onCloseClick}>
                    Cancel
                </Button>
                <Button variant='primary' left='check'>
                    Save
                </Button>
            </div>
        </div>
    );
}
