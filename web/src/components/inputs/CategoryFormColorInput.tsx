import { useController, UseControllerProps } from 'react-hook-form';
import { CategoryFormData } from '../category/CategoryForm';
import { CategoryFormColor } from '../../lib/categories';
import { buildClass } from '../../lib/utils';
import { Icon } from '../common';

type CategoryFormColorInputProps = UseControllerProps<
    CategoryFormData,
    'color'
> & {
    color: CategoryFormColor;
};

export function CategoryFormColorInput({
    color,
    ...props
}: CategoryFormColorInputProps) {
    const { field } = useController(props);
    const { value, onChange } = field;

    const isActive = value.bg === color.bg && value.fg === color.fg;

    return (
        <button
            className={buildClass(
                'w-9 h-9 rounded-lg flex items-center justify-center',
                [isActive, 'outline'],
            )}
            style={{
                backgroundColor: color.bg,
                color: color.fg,
                outlineColor: isActive ? color.fg : undefined,
            }}
            onClick={() => onChange(color)}
            type='button'
        >
            {isActive && <Icon icon='check' size={18} />}
        </button>
    );
}
