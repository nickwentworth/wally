import {
    LucideIcon,
    LucideProps,
    Plus,
    Settings,
    Receipt,
    Tag,
    X,
    Check,
    Briefcase,
    Car,
    Gift,
    House,
    ShoppingCart,
    Utensils,
    Trash2,
    ChevronDown,
    Search,
} from 'lucide-react';
import { CategoryIcon } from '../../lib/categories';

const CATEGORY_ICONS = {
    briefcase: Briefcase,
    car: Car,
    gift: Gift,
    house: House,
    shoppping: ShoppingCart,
    utensils: Utensils,
} satisfies Record<CategoryIcon, LucideIcon>;

const ICONS = {
    ...CATEGORY_ICONS,
    plus: Plus,
    close: X,
    trash: Trash2,
    check: Check,
    chevron: ChevronDown,
    search: Search,
    settings: Settings,
    receipt: Receipt,
    tag: Tag,
} satisfies Record<string, LucideIcon>;

export type IconType = keyof typeof ICONS;

type IconProps = { icon: IconType } & LucideProps;

export function Icon(props: IconProps) {
    const { icon, ...lucideProps } = props;

    const Element = ICONS[props.icon];

    return <Element size={14} {...lucideProps} />;
}
