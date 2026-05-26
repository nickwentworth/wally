import { Button, Text } from '../common';
import { CategoryIcon as _TODO_CategoryIcon } from './CategoryIcon';
import { Category, trpc } from '../../lib/trpc';
import { CATEGORY_ICONS } from 'backend/src/services/category';
import { useForm } from 'react-hook-form';
import z from 'zod';
import {
    CATEGORY_COLORS,
    CategoryFormColor,
    tryGetCategoryColor,
} from '../../lib/categories';
import { useMutation } from '@tanstack/react-query';
import { CategoryFormIconInput } from '../inputs/CategoryFormIconInput';
import { CategoryFormColorInput } from '../inputs/CategoryFormColorInput';

const CategoryFormData = z.object({
    name: z.string(),
    color: CategoryFormColor,
    icon: z.enum(CATEGORY_ICONS),
});
export type CategoryFormData = z.infer<typeof CategoryFormData>;

type CategoryFormProps = {
    category?: Category;
    onCancel: () => void;
    onSubmit: () => void;
};

export function CategoryForm(props: CategoryFormProps) {
    const { register, watch, control, handleSubmit } =
        useForm<CategoryFormData>({
            defaultValues: {
                name: props.category?.name,
                icon: props.category?.icon ?? CATEGORY_ICONS[0],
                color:
                    tryGetCategoryColor(props.category) ?? CATEGORY_COLORS[0],
            },
        });

    const categorySave = useMutation(trpc.category.save.mutationOptions());

    const color = watch('color');

    const onSubmit = handleSubmit((raw: any) => {
        const data = CategoryFormData.parse(raw);
        console.log(data);

        categorySave.mutate({
            name: data.name,
            bgColor: data.color.bg,
            fgColor: data.color.fg,
            icon: data.icon,
            id: props.category?.id,
        });
    });

    return (
        <form className='flex flex-col gap-4 p-4' onSubmit={onSubmit}>
            <div className='flex items-center gap-4'>
                <_TODO_CategoryIcon />

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
                        {CATEGORY_COLORS.map((c) => (
                            <CategoryFormColorInput
                                color={c}
                                control={control}
                                name='color'
                                key={c.bg + c.fg}
                            />
                        ))}
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <Text variant='uppercase'>Icon</Text>
                    <div className='flex flex-wrap gap-2'>
                        {CATEGORY_ICONS.map((i) => (
                            <CategoryFormIconInput
                                icon={i}
                                activeColor={color}
                                control={control}
                                name='icon'
                                key={i}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className='flex justify-end gap-2'>
                <Button variant='ghost' onClick={props.onCancel}>
                    Cancel
                </Button>
                <Button variant='primary' left='check' type='submit'>
                    Save
                </Button>
            </div>
        </form>
    );
}
