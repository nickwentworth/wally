import { useState } from 'react';
import { CategoryForm } from './CategoryForm';
import { CategoryIcon } from './CategoryIcon';
import { Icon, TableCell, TableRow } from '../common';
import { Category } from '../../lib/categories';

type CategoryRowProps = {
    category?: Category;
};

export function CategoryRow(props: CategoryRowProps) {
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
            className='hover:bg-cream-100 cursor-pointer'
            onClick={() => setIsExpanded(true)}
        >
            <TableCell>{props.category && <input type='checkbox' />}</TableCell>

            <TableCell>{props.category && <Icon icon='plus' />}</TableCell>

            <TableCell>
                <div className='flex items-center gap-2'>
                    {props.category ? (
                        <>
                            <CategoryIcon
                                variant='category'
                                category={props.category}
                            />
                            <span className='font-medium'>
                                {props.category.name}
                            </span>
                        </>
                    ) : (
                        <>
                            <CategoryIcon variant='empty' />
                            <span className='text-taupe-400'>Add Category</span>
                        </>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}
