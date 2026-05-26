import { useController, UseControllerProps } from 'react-hook-form';
import { CategoryFormData } from '../category/CategoryForm';
import { CategoryIcon } from '../../lib/trpc';
import { CategoryFormColor } from '../../lib/categories';
import { buildClass } from '../../lib/utils';
import { Icon } from '../common';

type CategoryFormIconInputProps = UseControllerProps<
    CategoryFormData,
    'icon'
> & {
    icon: CategoryIcon;
    activeColor: CategoryFormColor;
};

export function CategoryFormIconInput({
    icon,
    activeColor,
    ...props
}: CategoryFormIconInputProps) {
    const { field } = useController(props);
    const { value, onChange } = field;

    const isActive = value === icon;

    return (
        <button
            className={buildClass(
                'w-9 h-9 rounded-lg flex items-center justify-center',
                [isActive, 'outline'],
                [!isActive, 'bg-white'],
            )}
            style={
                isActive
                    ? {
                          backgroundColor: activeColor.bg,
                          color: activeColor.fg,
                          outlineColor: activeColor.fg,
                      }
                    : undefined
            }
            onClick={() => onChange(icon)}
            type='button'
        >
            <Icon icon={icon} size={18} />
        </button>
    );
}
