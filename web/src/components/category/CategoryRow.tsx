import { CategoryForm } from './CategoryForm';
import { CategoryIcon } from './CategoryIcon';
import { Icon, TableCell, TableRow } from '../common';
import { Category } from '../../lib/categories';
import { useSortable } from '@dnd-kit/react/sortable';

type CategoryRowProps = {
    category: Category;
    index: number;
    isExpanded: boolean;
    onExpand: () => void;
    onCollapse: () => void;
};

export function CategoryRow(props: CategoryRowProps) {
    const { ref, handleRef } = useSortable({
        id: props.category.id,
        index: props.index,
    });

    if (props.isExpanded) {
        return (
            <TableRow>
                <TableCell className='bg-cream-50' colSpan={3}>
                    <CategoryForm
                        category={props.category}
                        onCancel={() => props.onCollapse()}
                        onSubmit={() => props.onCollapse()}
                    />
                </TableCell>
            </TableRow>
        );
    }

    return (
        <TableRow
            ref={ref}
            className='hover:bg-cream-100 cursor-pointer group'
            onClick={() => props.onExpand()}
        >
            <TableCell ref={handleRef} className='hover:cursor-grab'>
                <Icon icon='grip' className='invisible group-hover:visible' />
            </TableCell>

            <TableCell>
                <input type='checkbox' className='block' />
            </TableCell>

            <TableCell>
                <div className='flex items-center gap-2'>
                    <CategoryIcon
                        variant='category'
                        category={props.category}
                    />
                    <span className='font-medium'>{props.category.name}</span>
                </div>
            </TableCell>
        </TableRow>
    );
}
