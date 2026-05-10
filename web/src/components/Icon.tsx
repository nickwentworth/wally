import {
    LucideIcon,
    LucideProps,
    Plus,
    Settings,
    Receipt,
    Tag,
} from 'lucide-react';

const ICONS = {
    plus: Plus,
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
