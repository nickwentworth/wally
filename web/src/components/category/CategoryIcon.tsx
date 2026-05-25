import { buildClass } from '../../lib/utils';
import { Icon } from '../common';
import { Category } from './CategoryTable';

type CategoryIconProps = {
    category?: Category;
};

export function CategoryIcon(props: CategoryIconProps) {
    const iconClassName = buildClass(
        'h-7 w-7 rounded-lg flex items-center justify-center',
        [!!props.category, 'bg-taupe-300 text-taupe-600'],
        [
            !props.category,
            'border-taupe-300 text-taupe-400 border border-dashed',
        ],
    );

    return (
        <div className={iconClassName}>
            <Icon icon={props.category?.icon ?? 'plus'} />
        </div>
    );
}
