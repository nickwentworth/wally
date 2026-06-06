import { useEffect, useRef, useState } from 'react';
import { Category, useCategories } from '../../lib/categories';
import { CategoryBadge } from '../category/CategoryBadge';
import { Icon } from '../common';
import { buildClass } from '../../lib/utils';
import { useDropdown } from '../../lib/hooks/useDropdown';

type CategorySelectProps = {
    selectedId?: number;
    onSelect: (c: Category) => void;
};

export function CategorySelect(props: CategorySelectProps) {
    const { data: categories } = useCategories();

    const [search, setSearch] = useState('');

    const dropdown = useDropdown({
        onOpen: () => inputRef.current?.focus(),
        onClose: () => setSearch(''),
    });

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
        <div className='relative' ref={dropdown.containerRef}>
            <button
                className='w-full h-10 bg-white border-cream-200 border rounded-lg flex items-center gap-2 p-2'
                onClick={() => dropdown.open()}
                type='button'
            >
                {search === '' ? (
                    <CategoryBadge variant='category' category={selected} />
                ) : (
                    <Icon icon='search' />
                )}

                <input
                    className='placeholder:text-taupe-700 grow min-w-0'
                    type='text'
                    placeholder={selected.name}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    ref={inputRef}
                />

                <Icon
                    icon='chevron'
                    className={buildClass('transition duration-200', [
                        dropdown.isOpen,
                        'rotate-180',
                    ])}
                />
            </button>

            {dropdown.isOpen && (
                <div
                    className={
                        'absolute top-full left-0 mt-1 max-h-30 overflow-auto w-full ' +
                        'bg-white border-cream-200 border shadow rounded-lg ' +
                        'flex flex-col p-1'
                    }
                >
                    {filteredCategories.length === 0 && (
                        <p className='text-xs text-center p-2'>No matches</p>
                    )}

                    {filteredCategories.map((category) => (
                        <button
                            className={buildClass(
                                'hover:bg-cream-100 rounded flex items-center gap-2 p-1',
                                [category == selected, 'bg-cream-50'],
                            )}
                            onClick={() => {
                                props.onSelect(category);
                                dropdown.close();
                            }}
                            type='button'
                            key={category.id}
                        >
                            <CategoryBadge
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
        </div>
    );
}
