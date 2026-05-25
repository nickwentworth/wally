import { IconType, Text } from '../common';
import { CategoryRow } from './CategoryRow';

// TODO: pull type and categories from DB
export type Category = {
    id: number;
    name: string;
    textColor: string;
    bgColor: string;
    icon: IconType;
};

const CATEGORIES_TMP = [
    {
        id: 1,
        name: 'Salary',
        textColor: '#1e5a32',
        bgColor: '#c8e4ce',
        icon: 'receipt',
    },
] satisfies Category[];

export function CategoryTable() {
    return (
        <table className='rounded-lg border-cream-200 border overflow-hidden'>
            <thead>
                <tr className='bg-cream-100'>
                    <th className='pl-4 pr-2 py-3 w-0'>
                        <input type='checkbox' />
                    </th>
                    <th></th>
                    <th>
                        <Text variant='uppercase'># Total</Text>
                    </th>
                </tr>
            </thead>
            <tbody>
                {CATEGORIES_TMP.map((category) => (
                    <CategoryRow category={category} key={category.id} />
                ))}
                <CategoryRow />
            </tbody>
        </table>
    );
}
