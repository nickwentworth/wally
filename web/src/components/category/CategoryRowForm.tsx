import { Button, Icon, Text } from '../common';
import { CategoryIcon } from './CategoryIcon';
import { buildClass } from '../../lib/utils';
import { Category, trpc } from '../../lib/trpc';
import { CATEGORY_ICONS } from 'backend/src/services/category';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { CATEGORY_COLORS, getCategoryColorIdx } from '../../lib/categories';
import { useMutation } from '@tanstack/react-query';

const CategoryFormData = z.object({
    name: z.string(),
    colorIdx: z.coerce.number(),
    icon: z.enum(CATEGORY_ICONS),
});
type CategoryFormData = z.infer<typeof CategoryFormData>;

type CategoryFormProps = {
    category?: Category;
    onCancelClick: () => void;
    onSubmitClick: () => void;
};

export function CategoryRowForm(props: CategoryFormProps) {
    const { register, watch, setValue, handleSubmit } =
        useForm<CategoryFormData>({
            defaultValues: {
                name: props.category?.name,
                icon: props.category?.icon,
                colorIdx: props.category
                    ? getCategoryColorIdx(props.category)
                    : undefined,
            },
        });

    const categorySave = useMutation(trpc.category.save.mutationOptions());

    const colorIdx = watch('colorIdx');
    const icon = watch('icon');

    const activeColor = CATEGORY_COLORS[colorIdx];

    const onSubmit = handleSubmit((raw: any) => {
        const data = CategoryFormData.parse(raw);
        console.log(data);

        categorySave.mutate({
            name: data.name,
            bgColor: activeColor.bg,
            fgColor: activeColor.fg,
            icon: data.icon,
            id: props.category?.id,
        });
    });

    return (
        <tr>
            <td colSpan={999} className='bg-cream-50 border-cream-200 border-t'>
                <form className='flex flex-col gap-4 p-4' onSubmit={onSubmit}>
                    <div className='flex items-center gap-4'>
                        <CategoryIcon />
                        <div className='flex flex-col gap-1'>
                            <Text variant='uppercase'>Name</Text>
                            <input
                                className='bg-cream-50 border-cream-400 border rounded-lg p-2 font-semibold'
                                type='text'
                                placeholder='Category name'
                                {...register('name', { required: true })}
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
                                            onClick={() =>
                                                setValue('colorIdx', idx)
                                            }
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
                                {CATEGORY_ICONS.map((i) => {
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
                                            onClick={() => setValue('icon', i)}
                                        >
                                            <Icon icon={i} size={18} />
                                        </button>
                                    );
                                })}
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
                </form>
            </td>
        </tr>
    );
}
