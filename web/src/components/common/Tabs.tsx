import { buildClass } from '../../lib/utils';
import { Icon, IconType } from './Icon';

export type Tab = {
    label: string;
    icon?: IconType;
};

type TabsProps<T extends string> = {
    tabs: Record<T, Tab>;
    active: T;
    onChange: (id: T) => void;
    variant: 'underline' | 'segmented';
};

export function Tabs<T extends string>(props: TabsProps<T>) {
    const entries = Object.entries(props.tabs) as [T, Tab][];

    const tabs = entries.map(([id, tab]) => ({
        id,
        ...tab,
        isActive: id === props.active,
    }));

    switch (props.variant) {
        case 'underline':
            return (
                <div className='flex border-b border-taupe-200'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={buildClass(
                                'flex items-center gap-2 px-4 py-2 -mb-px border-b-2',
                                [
                                    tab.isActive,
                                    'text-taupe-700 border-taupe-600',
                                ],
                                [
                                    !tab.isActive,
                                    'text-taupe-500 border-transparent',
                                ],
                            )}
                            type='button'
                            onClick={() => props.onChange(tab.id)}
                        >
                            {tab.icon && <Icon icon={tab.icon} />}
                            {tab.label}
                        </button>
                    ))}
                </div>
            );

        case 'segmented':
            return (
                <div className='h-10 bg-cream-100 flex p-0.75 gap-0.75 rounded-lg'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={buildClass(
                                'flex items-center font-medium px-3 rounded-md',
                                [tab.isActive, 'bg-white'],
                                [
                                    !tab.isActive,
                                    'text-taupe-400 hover:text-taupe-600 hover:bg-cream-200',
                                ],
                            )}
                            type='button'
                            onClick={() => props.onChange(tab.id)}
                        >
                            {tab.icon && <Icon icon={tab.icon} />}
                            {tab.label}
                        </button>
                    ))}
                </div>
            );
    }
}
