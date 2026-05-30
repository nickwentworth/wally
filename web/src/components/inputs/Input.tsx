import { buildClass } from '../../lib/utils';

type InputProps = React.ComponentProps<'input'> & {
    variant?: undefined;
};

type TextareaProps = React.ComponentProps<'textarea'> & {
    variant: 'textarea';
};

type GenericInputProps = InputProps | TextareaProps;

export function Input(props: GenericInputProps) {
    const cn = buildClass(
        'bg-white border-cream-200 border',
        'p-2 rounded-lg font-regular',
        [props.variant === undefined, 'h-10'],
        [props.variant === 'textarea', 'resize-y'],
        props.className ?? '',
    );

    if (props.variant === 'textarea') {
        const { variant, className, ...rest } = props;
        return <textarea className={cn} {...rest}></textarea>;
    } else {
        const { className, ...rest } = props;
        return <input className={cn} {...rest} />;
    }
}
