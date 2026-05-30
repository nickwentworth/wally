import { Category, CategoryIcon } from '../../lib/categories';
import { buildClass } from '../../lib/utils';
import { Icon, IconType } from '../common';

type CategoryBadgePropsBase =
    // Regular-use case icon for an existing category
    | { variant: 'category'; category: Category }
    // Option for providing props directly as parts
    | { variant: 'parts'; icon: CategoryIcon; fg: string; bg: string }
    // Special case for use in category form color selection
    | { variant: 'color'; fg: string; bg: string }
    // Special case for use in empty category row
    | { variant: 'empty' };

type CategoryBadgeProps = CategoryBadgePropsBase & {
    size?: 'md' | 'lg';
    isSelected?: boolean;
    onSelect?: () => void;
};

export function CategoryBadge(props: CategoryBadgeProps) {
    const containerClass = buildClass(
        'rounded-lg flex items-center justify-center',
        [!props.size || props.size === 'md', 'h-7 w-7'],
        [props.size === 'lg', 'h-9 w-9'],
        [props.isSelected ?? false, 'outline'],
        [props.variant === 'empty', 'border-taupe-300 border border-dashed'],
    );

    let icon: IconType;
    let fg: string;
    let bg: string;
    switch (props.variant) {
        case 'category':
            icon = props.category.icon;
            fg = props.category.fgColor;
            bg = props.category.bgColor;
            break;

        case 'parts':
            icon = props.icon;
            fg = props.fg;
            bg = props.bg;
            break;

        case 'color':
            icon = 'check';
            fg = props.isSelected ? props.fg : 'transparent';
            bg = props.bg;
            break;

        case 'empty':
            icon = 'plus';
            fg = 'var(--color-taupe-400)';
            bg = 'transparent';
            break;
    }

    const iconSize = props.size === 'lg' ? 18 : 14;

    if (props.onSelect) {
        return (
            <button
                className={containerClass}
                style={{
                    color: fg,
                    backgroundColor: bg,
                    outlineColor: fg,
                }}
                onClick={props.onSelect}
                type='button'
            >
                <Icon icon={icon} size={iconSize} />
            </button>
        );
    }

    return (
        <div
            className={containerClass}
            style={{
                color: fg,
                backgroundColor: bg,
                outlineColor: fg,
            }}
        >
            <Icon icon={icon} size={iconSize} />
        </div>
    );
}
