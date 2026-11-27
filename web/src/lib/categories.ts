import { CategoryFormColor } from '../components/category/CategoryForm';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiInput, ApiOutput, unwrap } from './api';
import { IconType } from '../components/common';

// -------------------- Hooks -------------------- //

const categoryKey = ['category'];

export function useCategories() {
    return useQuery({
        queryFn: async () => {
            const categories = await unwrap(apiClient.GET('/category/all'));
            return categories.map(categoryFromApi);
        },
        queryKey: categoryKey,
    });
}

type UseCategoryCreateOpts = {
    onSuccess?: () => void;
};

export function useCategoryCreate(opts: UseCategoryCreateOpts) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (category: ApiInput<'/category/create', 'post'>) =>
            unwrap(apiClient.POST('/category/create', { body: category })),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: categoryKey });
            opts.onSuccess?.();
        },
    });
}

type UseCategoryUpdateOpts = {
    onSuccess?: () => void;
};

export function useCategoryUpdate(opts: UseCategoryUpdateOpts) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (category: ApiInput<'/category/update', 'post'>) =>
            unwrap(apiClient.POST('/category/update', { body: category })),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: categoryKey });
            opts.onSuccess?.();
        },
    });
}

type CategoryMoveVars = {
    input: ApiInput<'/category/move', 'post'>;
    reordered: Category[];
};

export function useCategoryMove() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (vars: CategoryMoveVars) =>
            unwrap(apiClient.POST('/category/move', { body: vars.input })),

        // Provide updated ordering for react to handle re-renders correctly
        onMutate: (vars) => qc.setQueryData(categoryKey, vars.reordered),

        onSettled: () => qc.invalidateQueries({ queryKey: categoryKey }),
    });
}

type UseCategoryDeleteOpts = {
    onSuccess?: () => void;
};

export function useCategoryDelete(opts: UseCategoryDeleteOpts) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (category: ApiInput<'/category/delete', 'post'>) =>
            unwrap(apiClient.POST('/category/delete', { body: category })),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: categoryKey });
            opts.onSuccess?.();
        },
    });
}

// -------------------- Types / Constants -------------------- //

type CategoryApi = ApiOutput<'/category/all', 'get'>[number];

export type Category = Omit<CategoryApi, 'icon'> & {
    icon: CategoryIconName;
};

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
] satisfies CategoryFormColor[];

export function tryGetCategoryColor(category?: Category) {
    return CATEGORY_COLORS.find(
        (color) =>
            color.bg === category?.bgColor && color.fg === category?.fgColor,
    );
}

export const CATEGORY_ICONS = [
    'briefcase',
    'car',
    'gift',
    'house',
    'shopping',
    'utensils',
    'dollar',
] satisfies IconType[];

export type CategoryIconName = (typeof CATEGORY_ICONS)[number];

function categoryFromApi(category: CategoryApi): Category {
    return {
        ...category,
        icon: CATEGORY_ICONS.some((icon) => icon === category.icon)
            ? (category.icon as CategoryIconName)
            : 'dollar', // fallback
    };
}
