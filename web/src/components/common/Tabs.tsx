import { buildClass } from '../../lib/utils';
import { Icon, IconType } from './Icon';

export type Tab = {
    label: string;
    icon: IconType;
};

type TabsProps<T extends string> = {
    tabs: Record<T, Tab>;
    active: T;
    onChange: (id: T) => void;
};

export function Tabs<T extends string>(props: TabsProps<T>) {
    const entries = Object.entries(props.tabs) as [T, Tab][];

    return (
        <div className='flex border-b border-taupe-200'>
            {entries.map(([id, tab]) => {
                const isActive = id === props.active;

                const btnClass = buildClass(
                    'flex items-center gap-2 px-4 py-2 -mb-px border-b-2',
                    [isActive, 'text-taupe-700 border-taupe-600'],
                    [!isActive, 'text-taupe-500 border-transparent'],
                );

                return (
                    <button
                        key={id}
                        className={btnClass}
                        type='button'
                        onClick={() => props.onChange(id)}
                    >
                        <Icon icon={tab.icon} />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
