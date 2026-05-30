import { buildClass } from '../../lib/utils';

type ToggleProps = {
    isToggled: boolean;
    onToggle: (b: boolean) => void;
};

export function Toggle(props: ToggleProps) {
    const containerClass = buildClass(
        'rounded-full inline-flex p-0.5 inset-shadow-sm transition-[padding]',
        [props.isToggled, 'bg-moss-500 pl-4'],
        [!props.isToggled, 'bg-taupe-300 pr-4'],
    );

    return (
        <button
            className={containerClass}
            onClick={() => props.onToggle(!props.isToggled)}
            type='button'
        >
            <div className='bg-white h-5 w-5 rounded-full shadow'></div>
        </button>
    );
}
