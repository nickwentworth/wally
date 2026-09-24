import { useState } from 'react';
import { useCategories } from '../../lib/categories';
import { useDropdown } from '../../lib/hooks/useDropdown';
import { buildClass } from '../../lib/utils';
import { Icon } from '../common';
import { Input } from './Input';
import { CategoryIcon } from '../category/CategoryIcon';

type TxnSearchBarProps = {
    categoryIds: number[];
    onCategoryIdsChange: (ids: number[]) => void;
    search: string;
    onSearchChange: (s: string) => void;
};

export function TxnSearchBar(props: TxnSearchBarProps) {
    const [catSearch, setCatSearch] = useState('');

    const { data: categories } = useCategories();
    const dropdown = useDropdown({
        onClose: () => setCatSearch(''),
    });

    const selectedCategories =
        categories?.filter((cat) => props.categoryIds.includes(cat.id)) ?? [];

    const filteredCategories =
        categories?.filter((cat) =>
            cat.name.toLowerCase().includes(catSearch.toLowerCase()),
        ) ?? [];

    const toggleCategory = (categoryId: number) => {
        if (props.categoryIds.includes(categoryId)) {
            props.onCategoryIdsChange(
                props.categoryIds.filter((id) => id !== categoryId),
            );
        } else {
            props.onCategoryIdsChange([...props.categoryIds, categoryId]);
        }
    };

    return (
        <div className='w-full h-10 bg-white border-cream-200 border rounded-lg flex'>
            <div className='relative flex' ref={dropdown.containerRef}>
                <button
                    className='flex items-center pl-3 pr-2 gap-2 border-cream-200 border-r'
                    onClick={() => dropdown.open()}
                    type='button'
                >
                    <Icon icon='grid' />

                    {selectedCategories.length === 0 && <span>All</span>}
                    {selectedCategories.length === 1 && (
                        <span>{selectedCategories[0].name}</span>
                    )}
                    {selectedCategories.length > 1 && (
                        <span>{selectedCategories.length} categories</span>
                    )}

                    {selectedCategories.length > 0 && (
                        <button
                            className='bg-cream-200 hover:bg-cream-300 p-0.75 rounded-full'
                            type='button'
                            onClick={() => props.onCategoryIdsChange([])}
                        >
                            <Icon icon='close' size={10} />
                        </button>
                    )}

                    <Icon
                        icon='chevron'
                        className={buildClass(
                            'ml-auto transition duration-200',
                            [dropdown.isOpen, 'rotate-180'],
                        )}
                    />
                </button>

                {dropdown.isOpen && (
                    <div
                        className={
                            'absolute top-full left-0 w-60 mt-1 ' +
                            'bg-white border-cream-200 border shadow rounded-lg ' +
                            'flex flex-col'
                        }
                    >
                        <div className='p-2 border-cream-200 border-b'>
                            <Input
                                className='w-full'
                                value={catSearch}
                                onChange={(e) => setCatSearch(e.target.value)}
                                placeholder='Search categories'
                            />
                        </div>

                        <div className='border-cream-200 border-b flex justify-between p-2'>
                            <button
                                className='text-[11px]'
                                onClick={() =>
                                    props.onCategoryIdsChange(
                                        filteredCategories.map((cat) => cat.id),
                                    )
                                }
                                type='button'
                            >
                                Select all
                            </button>
                            <button
                                className='text-[11px]'
                                onClick={() => props.onCategoryIdsChange([])}
                                type='button'
                            >
                                Clear
                            </button>
                        </div>

                        <div className='flex flex-col p-1 max-h-80 overflow-auto'>
                            {filteredCategories.length === 0 && (
                                <span className='text-taupe-400 text-xs text-center py-4'>
                                    No categories match "{catSearch}"
                                </span>
                            )}

                            {filteredCategories.map((cat) => {
                                const isSelected = props.categoryIds.includes(
                                    cat.id,
                                );

                                return (
                                    <button
                                        key={cat.id}
                                        className={buildClass(
                                            'hover:bg-cream-100 rounded flex items-center gap-2 p-2',
                                            [isSelected, 'bg-cream-50'],
                                        )}
                                        onClick={() => toggleCategory(cat.id)}
                                        type='button'
                                    >
                                        {/* TODO: maybe this can be a generic checkbox? */}
                                        <div
                                            className={buildClass(
                                                'h-4 w-4 flex items-center justify-center rounded-sm',
                                                [
                                                    isSelected,
                                                    'bg-moss-500 text-cream-50',
                                                ],
                                                [
                                                    !isSelected,
                                                    'border-cream-200 border',
                                                ],
                                            )}
                                        >
                                            {isSelected && (
                                                <Icon icon='check' size={12} />
                                            )}
                                        </div>

                                        <CategoryIcon
                                            variant='category'
                                            category={cat}
                                            size='sm'
                                        />
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className='grow flex items-center gap-2 px-3'>
                <Icon icon='search' className='text-taupe-400' />

                <input
                    className='h-full grow'
                    value={props.search}
                    onChange={(e) => props.onSearchChange(e.target.value)}
                    placeholder='Search transactions'
                />

                {props.search.length > 0 && (
                    <button
                        className='bg-cream-200 hover:bg-cream-300 p-0.75 rounded-full'
                        type='button'
                        onClick={() => props.onSearchChange('')}
                    >
                        <Icon icon='close' size={10} />
                    </button>
                )}
            </div>
        </div>
    );
}
