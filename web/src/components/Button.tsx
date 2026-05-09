import { PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<{
    variant: 'primary';
}>;

export function Button(props: ButtonProps) {
    return (
        <button className='bg-moss-500 hover:bg-moss-600 text-cream-50 font-semibold px-4 py-2 rounded-lg cursor-pointer'>
            {props.children}
        </button>
    );
}
