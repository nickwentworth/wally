import { Button, Text } from '../common';
import { CategoryBadge } from './CategoryBadge';
import { Category, trpc } from '../../lib/trpc';
import { CATEGORY_ICONS } from 'backend/src/services/category';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { CATEGORY_COLORS, tryGetCategoryColor } from '../../lib/categories';
import { useMutation } from '@tanstack/react-query';

const CategoryFormColor = z.object({
    bg: z.string(),
    fg: z.string(),
});
export type CategoryFormColor = z.infer<typeof CategoryFormColor>;

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
    const { register, watch, setValue, handleSubmit } =
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
    const icon = watch('icon');

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

    const activeAwareColors = CATEGORY_COLORS.map(
        (c) => [c, c.fg === color.fg && c.bg === color.bg] as const,
    );
    const activeAwareIcons = CATEGORY_ICONS.map(
        (i) => [i, i === icon] as const,
    );

    return (
        <form className='flex flex-col gap-4 p-4' onSubmit={onSubmit}>
            <div className='flex items-center gap-4'>
                <CategoryBadge
                    variant='parts'
                    fg={color.fg}
                    bg={color.bg}
                    icon={icon}
                    size='lg'
                />

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
                        {activeAwareColors.map(([c, isActive]) => (
                            <CategoryBadge
                                variant='color'
                                fg={c.fg}
                                bg={c.bg}
                                isSelected={isActive}
                                onSelect={() => setValue('color', c)}
                                size='lg'
                                key={c.bg + c.fg}
                            />
                        ))}
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <Text variant='uppercase'>Icon</Text>
                    <div className='flex flex-wrap gap-2'>
                        {activeAwareIcons.map(([i, isActive]) => (
                            <CategoryBadge
                                variant='parts'
                                icon={i}
                                fg={isActive ? color.fg : 'unset'}
                                bg={isActive ? color.bg : 'white'}
                                isSelected={isActive}
                                onSelect={() => setValue('icon', i)}
                                size='lg'
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
