import { Text } from '../common';
import { CategoryRow } from './CategoryRow';
import { useCategories } from '../../lib/categories';

export function CategoryTable() {
    const { data: categories } = useCategories();

    if (categories === undefined) {
        return <p>Loading...</p>;
    }

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
                {categories.map((category) => (
                    <CategoryRow category={category} key={category.id} />
                ))}
                <CategoryRow />
            </tbody>
        </table>
    );
}
