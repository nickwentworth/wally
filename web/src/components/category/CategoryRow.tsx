import { useState } from 'react';
import { CategoryForm } from './CategoryForm';
import { CategoryIcon } from './CategoryIcon';
import { Icon, TableCell, TableRow } from '../common';
import { Category } from '../../lib/categories';
import { useSortable } from '@dnd-kit/react/sortable';

type CategoryRowProps = {
    category: Category;
    index: number;
};

export function CategoryRow(props: CategoryRowProps) {
    const { ref, handleRef } = useSortable({
        id: props.category.id,
        index: props.index,
    });

    const [isExpanded, setIsExpanded] = useState(false);

    if (isExpanded) {
        return (
            <TableRow>
                <TableCell className='bg-cream-50' colSpan={3}>
                    <CategoryForm
                        category={props.category}
                        onCancel={() => setIsExpanded(false)}
                        onSubmit={() => setIsExpanded(false)}
                    />
                </TableCell>
            </TableRow>
        );
    }

    return (
        <TableRow
            ref={ref}
            className='hover:bg-cream-100 cursor-pointer group'
            onClick={() => setIsExpanded(true)}
        >
            <TableCell ref={handleRef} className='hover:cursor-grab'>
                <Icon icon='grip' className='invisible group-hover:visible' />
            </TableCell>

            <TableCell>
                <input type='checkbox' className='block' />
            </TableCell>

            <TableCell>
                <div className='flex items-center gap-2'>
                    {/* {props.category ? (
                        <> */}
                    <CategoryIcon
                        variant='category'
                        category={props.category}
                    />
                    <span className='font-medium'>{props.category.name}</span>
                    {/* </>
                    ) : (
                        <>
                            <CategoryIcon variant='empty' />
                            <span className='text-taupe-400'>Add Category</span>
                        </>
                    )} */}
                </div>
            </TableCell>
        </TableRow>
    );
}
