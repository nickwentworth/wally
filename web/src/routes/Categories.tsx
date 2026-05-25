import { CategoryTable } from '../components/category/CategoryTable';

export function Categories() {
    return (
        <div className='bg-cream-50 flex flex-col grow'>
            <h1 className='h-20 border-cream-200 border-b flex items-center px-8'>
                Categories
            </h1>

            <div className='flex flex-col px-8 py-6'>
                <CategoryTable />
            </div>
        </div>
    );
}
