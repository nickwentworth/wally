import type { LucideIcon, LucideProps } from 'lucide-react';
import * as L from 'lucide-react';

const ICONS = {
    // Generic
    check: L.Check,
    close: L.X,
    plus: L.Plus,
    search: L.Search,
    trash: L.Trash2,

    // Helpers
    chevron: L.ChevronDown, // TODO: rename to chevronDown
    chevronRight: L.ChevronRight,
    grip: L.GripVertical,
    spinner: L.LoaderCircle,

    // UI specific
    calendar: L.Calendar,
    grid: L.LayoutGrid,
    list: L.List,
    logout: L.LogOut,
    receipt: L.Receipt,
    repeat: L.Repeat,
    settings: L.Settings,
    tag: L.Tag,

    // Category specific
    briefcase: L.Briefcase,
    car: L.Car,
    gift: L.Gift,
    house: L.House,
    shopping: L.ShoppingCart,
    utensils: L.Utensils,
    dollar: L.DollarSign,
} satisfies Record<string, LucideIcon>;

export type IconType = keyof typeof ICONS;

type IconProps = { icon: IconType } & LucideProps;

export function Icon(props: IconProps) {
    const { icon, ...lucideProps } = props;

    const Element = ICONS[props.icon];

    return <Element size={14} {...lucideProps} />;
}
