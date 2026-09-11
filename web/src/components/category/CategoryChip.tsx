import { Category } from '../../lib/categories';
import { Icon, Text } from '../common';

type CategoryChipProps = {
    category: Category;
};

export function CategoryChip(props: CategoryChipProps) {
    return (
        <span
            className='h-6 px-2 inline-flex items-center gap-1.5 rounded-full'
            style={{
                backgroundColor: props.category.bgColor,
                color: props.category.fgColor,
            }}
        >
            <Icon icon={props.category.icon} size={14} />
            <span className='text-xs font-medium'>{props.category.name}</span>
        </span>
    );
}
