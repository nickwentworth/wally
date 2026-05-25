import { useState } from 'react';
import { Button, Icon, Text } from '../common';
import { CategoryIcon } from './CategoryIcon';
import { Category } from './CategoryTable';
import { buildClass } from '../../lib/utils';
import { IconType } from '../common/Icon';

export const CATEGORY_COLORS = [
    { bg: '#FBD4D9', fg: '#8A1F31' },
    { bg: '#FCD7C4', fg: '#8A3513' },
    { bg: '#FAE3B8', fg: '#7A4E0B' },
    { bg: '#F7EBB0', fg: '#6B5400' },
    { bg: '#DEEDB6', fg: '#3E5A09' },
    { bg: '#C8E4CE', fg: '#1E5A32' },
    { bg: '#BDE6D7', fg: '#0F5A3F' },
    { bg: '#B9E1E2', fg: '#0B4D57' },
    { bg: '#C5DEEE', fg: '#0F4B70' },
    { bg: '#C9D7F1', fg: '#1E3B80' },
    { bg: '#D4CFF0', fg: '#30268A' },
    { bg: '#E0CDEE', fg: '#4A1D82' },
    { bg: '#EDCFE4', fg: '#6E1569' },
    { bg: '#ECD1DB', fg: '#6B1A41' },
    { bg: '#DDD7C8', fg: '#4F4628' },
];

type CategoryFormProps = {
    category?: Category;
    onCancelClick: () => void;
    onSubmitClick: () => void;
};

export function CategoryRowForm(props: CategoryFormProps) {
    const [colorIdx, setColorIdx] = useState(() => {
        const idx = CATEGORY_COLORS.findIndex(
            (c) => c.bg === props.category?.bgColor,
        );
        return idx !== -1 ? idx : 0;
    });
    const activeColor = CATEGORY_COLORS[colorIdx];

    const [icon, setIcon] = useState<IconType>('tag');

    return (
        <tr>
            <td colSpan={3} className='bg-cream-50 border-cream-200 border-t'>
                <div className='flex flex-col gap-4 p-4'>
                    <div className='flex items-center gap-4'>
                        <CategoryIcon />
                        <div className='flex flex-col gap-1'>
                            <Text variant='uppercase'>Name</Text>
                            <input
                                className='bg-cream-50 border-cream-400 border rounded-lg p-2 font-semibold'
                                type='text'
                                placeholder='Category name'
                            />
                        </div>
                    </div>

                    <div className='bg-cream-100 border-cream-200 border rounded-lg flex flex-col gap-4 p-4'>
                        <div className='flex flex-col gap-2'>
                            <Text variant='uppercase'>Color</Text>
                            <div className='flex flex-wrap gap-2'>
                                {CATEGORY_COLORS.map((c, idx) => {
                                    const isActive = c === activeColor;
                                    return (
                                        <button
                                            className={buildClass(
                                                'w-9 h-9 rounded-lg flex items-center justify-center',
                                                [isActive, 'outline'],
                                            )}
                                            style={{
                                                backgroundColor: c.bg,
                                                color: c.fg,
                                                outlineColor: isActive
                                                    ? c.fg
                                                    : undefined,
                                            }}
                                            onClick={() => setColorIdx(idx)}
                                        >
                                            {isActive && (
                                                <Icon icon='check' size={18} />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Text variant='uppercase'>Icon</Text>
                            <div className='flex flex-wrap gap-2'>
                                {(['plus', 'receipt', 'tag'] as const).map(
                                    (i) => {
                                        const isActive = i === icon;
                                        return (
                                            <button
                                                className={buildClass(
                                                    'w-9 h-9 rounded-lg flex items-center justify-center',
                                                    [isActive, 'outline'],
                                                    [!isActive, 'bg-white'],
                                                )}
                                                style={
                                                    isActive
                                                        ? {
                                                              backgroundColor:
                                                                  activeColor.bg,
                                                              color: activeColor.fg,
                                                              outlineColor:
                                                                  activeColor.fg,
                                                          }
                                                        : undefined
                                                }
                                                onClick={() => setIcon(i)}
                                            >
                                                <Icon icon={i} size={18} />
                                            </button>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-end gap-2'>
                        <Button variant='ghost' onClick={props.onCancelClick}>
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            left='check'
                            onClick={props.onSubmitClick}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </td>
        </tr>
    );
}
