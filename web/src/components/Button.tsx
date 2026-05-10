import { PropsWithChildren } from 'react';
import { Icon, IconType } from './Icon';

type ButtonProps = PropsWithChildren<{
    variant: 'primary';
    left?: IconType;
}>;

export function Button(props: ButtonProps) {
    const className =
        'bg-moss-500 hover:bg-moss-600 text-cream-50' +
        ' font-medium text-[13px]' +
        ' flex items-center justify-center gap-2 px-4 py-2' +
        ' rounded-lg cursor-pointer';

    return (
        <button className={className}>
            {props.left && <Icon icon={props.left} />}
            {props.children}
        </button>
    );
}
