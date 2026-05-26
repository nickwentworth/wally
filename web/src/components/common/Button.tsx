import { PropsWithChildren } from 'react';
import { Icon, IconType } from './Icon';
import { buildClass } from '../../lib/utils';

type ButtonProps = PropsWithChildren<{
    variant: 'primary' | 'ghost';
    left?: IconType;
    onClick?: () => void;
    type?: 'button' | 'submit';
}>;

export function Button(props: ButtonProps) {
    const className = buildClass(
        [
            props.variant === 'primary',
            'bg-moss-500 hover:bg-moss-600 text-cream-50',
        ],
        [
            props.variant === 'ghost',
            'bg-transparent hover:bg-cream-200 text-taupe-900',
        ],
        'font-medium text-[13px] rounded-lg',
        'flex items-center justify-center gap-2 px-4 py-2',
    );

    return (
        <button
            className={className}
            onClick={props.onClick}
            type={props.type ?? 'button'}
        >
            {props.left && <Icon icon={props.left} />}
            {props.children}
        </button>
    );
}
