type TextProps = {
    variant: 'uppercase';
    children: string;
};

export function Text(props: TextProps) {
    switch (props.variant) {
        case 'uppercase':
            return (
                <span className='text-taupe-400 text-xs font-semibold tracking-wider uppercase'>
                    {props.children}
                </span>
            );
    }
}
