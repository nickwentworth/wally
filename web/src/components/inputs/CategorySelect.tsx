import { useRef, useState } from 'react';
import { Category, useCategories } from '../../lib/categories';
import { CategoryIcon } from '../category/CategoryIcon';
import { Icon, Popover } from '../common';
import { buildClass } from '../../lib/utils';

type CategorySelectProps = {
    selectedId?: number;
    onSelect: (c: Category) => void;
};

export function CategorySelect(props: CategorySelectProps) {
    const { data: categories } = useCategories();

    const [search, setSearch] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);

    if (categories === undefined) {
        return <p>Loading...</p>;
    } else if (categories.length === 0) {
        return <p>Empty!</p>;
    }

    const selected =
        categories.find((c) => c.id === props.selectedId) ?? categories[0];

    const filteredCategories = categories.filter((c) =>
        c.name.toUpperCase().includes(search.toUpperCase()),
    );

    return (
        <Popover
            trigger={(args) => (
                <button
                    className={buildClass(
                        'w-full h-10 bg-white border-cream-200 border',
                        'flex items-center gap-2 p-2 rounded-lg',
                    )}
                    style={{ anchorName: args.anchorName }}
                    onClick={() => args.open()}
                    onFocus={() => args.open()}
                    type='button'
                >
                    {search === '' ? (
                        <CategoryIcon variant='category' category={selected} />
                    ) : (
                        <Icon icon='search' />
                    )}

                    <input
                        className='placeholder:text-taupe-700 grow min-w-0 outline-none'
                        type='text'
                        placeholder={selected.name}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        ref={inputRef}
                    />

                    <Icon
                        icon='chevron'
                        className={buildClass(
                            'shrink-0 transition duration-200',
                            [args.isOpen, 'rotate-180'],
                        )}
                    />
                </button>
            )}
            content={(args) => (
                <div
                    className={buildClass(
                        'w-full max-h-50 overflow-auto',
                        'bg-white border-cream-200 hover:border-cream-400 border',
                        'flex flex-col p-1 shadow rounded-lg',
                    )}
                >
                    {filteredCategories.length === 0 && (
                        <p className='text-xs text-center p-2'>No matches</p>
                    )}

                    {filteredCategories.map((category) => (
                        <button
                            key={category.id}
                            className={buildClass(
                                'hover:bg-cream-100 rounded flex items-center gap-2 p-1',
                                [category == selected, 'bg-cream-50'],
                            )}
                            onClick={() => {
                                props.onSelect(category);
                                args.close();
                            }}
                            type='button'
                        >
                            <CategoryIcon
                                variant='category'
                                category={category}
                            />

                            {category.name}

                            {category == selected && (
                                <Icon icon='check' className='ml-auto' />
                            )}
                        </button>
                    ))}
                </div>
            )}
            onOpen={() => inputRef.current?.focus()}
            onClose={() => {
                inputRef.current?.blur();
                setSearch('');
            }}
            placement='below'
            gap='sm'
        />
    );
}
