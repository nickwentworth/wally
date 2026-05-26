import { useState } from 'react';
import { CategoryForm } from './CategoryForm';
import { CategoryIcon } from './CategoryIcon';
import { Icon } from '../common';
import { Category } from '../../lib/trpc';

type CategoryRowProps = {
    category?: Category;
};

export function CategoryRow(props: CategoryRowProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (isExpanded) {
        return (
            <tr>
                <td
                    colSpan={999}
                    className='bg-cream-50 border-cream-200 border-t'
                >
                    <CategoryForm
                        category={props.category}
                        onCancel={() => setIsExpanded(false)}
                        onSubmit={() => setIsExpanded(false)}
                    />
                </td>
            </tr>
        );
    }

    return (
        <tr
            className='bg-white hover:bg-cream-100 cursor-pointer'
            onClick={() => setIsExpanded(true)}
        >
            <td className='border-cream-200 border-t pl-4 pr-2 py-3 w-0'>
                {props.category && <input type='checkbox' />}
            </td>
            <td className='border-cream-200 border-t px-2 py-3 w-0'>
                {props.category && <Icon icon='plus' />}
            </td>
            <td className='border-cream-200 border-t px-2 py-3 flex items-center gap-2'>
                <CategoryIcon category={props.category} />
                {props.category ? (
                    <span className='font-medium'>{props.category.name}</span>
                ) : (
                    <span className='text-taupe-400'>Add Category</span>
                )}
            </td>
        </tr>
    );
}
