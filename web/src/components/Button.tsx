import { PropsWithChildren } from 'react';
import { Icon, IconType } from './Icon';

type ButtonProps = PropsWithChildren<{
    variant: 'primary';
    left?: IconType;
    onClick?: () => void;
}>;

export function Button(props: ButtonProps) {
    const className =
        'bg-moss-500 hover:bg-moss-600 text-cream-50' +
        ' font-medium text-[13px]' +
        ' flex items-center justify-center gap-2 px-4 py-2' +
        ' rounded-lg';

    return (
        <button className={className} onClick={props.onClick}>
            {props.left && <Icon icon={props.left} />}
            {props.children}
        </button>
    );
}
