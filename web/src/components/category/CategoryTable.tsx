import { Table, TableHeader, TableRow } from '../common';
import { CategoryRow } from './CategoryRow';
import { useCategories } from '../../lib/categories';

export function CategoryTable() {
    const { data: categories } = useCategories();

    if (categories === undefined) {
        return <p>Loading...</p>;
    }

    return (
        <Table variant='rows'>
            <thead>
                <TableRow>
                    <TableHeader className='w-0' />
                    <TableHeader className='w-0' />
                    <TableHeader text={categories.length + ' total'} />
                </TableRow>
            </thead>

            <tbody>
                {categories.map((category) => (
                    <CategoryRow category={category} key={category.id} />
                ))}
                <CategoryRow />
            </tbody>
        </Table>
    );
}
