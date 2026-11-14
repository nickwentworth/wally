import React from 'react';

type TextProps = {
    variant: 'uppercase' | 'hint';
    children: React.ReactNode;
};

export function Text(props: TextProps) {
    switch (props.variant) {
        case 'uppercase':
            return (
                <span className='text-taupe-400 text-xs font-medium tracking-wider uppercase'>
                    {props.children}
                </span>
            );

        case 'hint':
            return (
                <span className='text-taupe-500 text-xs font-light'>
                    {props.children}
                </span>
            );
    }
}
