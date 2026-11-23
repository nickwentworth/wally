import { useRef } from 'react';
import {
    CategoryTable,
    CategoryTableControls,
} from '../components/category/CategoryTable';
import { Button } from '../components/common';

export function Categories() {
    const tableRef = useRef<CategoryTableControls>(null);

    return (
        <div className='bg-cream-50 flex flex-col grow'>
            <div className='h-20 border-cream-200 border-b flex items-center px-8'>
                <h1 className='mr-auto'>Categories</h1>

                <Button
                    variant='primary'
                    left='plus'
                    onClick={() => tableRef.current?.openCreateForm()}
                >
                    Add category
                </Button>
            </div>

            <div className='flex flex-col px-8 py-6'>
                <CategoryTable ref={tableRef} />
            </div>
        </div>
    );
}
