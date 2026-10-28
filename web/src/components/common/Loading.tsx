import { Icon } from './Icon';

type Size = 'md' | 'lg';

type LoadingProps = {
    variant: 'spin';
    size?: Size;
};

export function Loading(props: LoadingProps) {
    if (props.variant === 'spin') {
        const sizes = {
            md: 16,
            lg: 32,
        } satisfies Record<Size, number>;

        return (
            <Icon
                icon='spinner'
                className='animate-spin'
                size={sizes[props.size ?? 'md']}
            />
        );
    }
}
