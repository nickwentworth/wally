import { Table, TableHeader, TableRow } from '../common';
import { CategoryRow } from './CategoryRow';
import { useCategories, useCategoryMove } from '../../lib/categories';
import { DragDropProvider } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';

export function CategoryTable() {
    const { data: categories } = useCategories();
    const categoryMove = useCategoryMove();

    if (categories === undefined) {
        return <p>Loading...</p>;
    }

    return (
        <DragDropProvider
            onDragEnd={(event) => {
                if (event.canceled) return;

                const { source } = event.operation;

                if (!isSortable(source)) return;
                if (source.index === source.initialIndex) return;

                // Replicate the drag-and-drop move operation
                const reordered = [...categories];
                const [moved] = reordered.splice(source.initialIndex, 1);
                reordered.splice(source.index, 0, moved);

                categoryMove.mutate({
                    input: {
                        id: moved.id,
                        afterId: reordered[source.index - 1]?.id,
                        beforeId: reordered[source.index + 1]?.id,
                    },
                    reordered,
                });
            }}
        >
            <Table variant='rows'>
                <thead>
                    <TableRow>
                        <TableHeader className='w-0' />
                        <TableHeader className='w-0' />
                        <TableHeader text={categories.length + ' total'} />
                    </TableRow>
                </thead>

                <tbody>
                    {/* TODO: add updated Add Category button */}
                    {categories.map((category, idx) => (
                        <CategoryRow
                            key={category.id}
                            category={category}
                            index={idx}
                        />
                    ))}
                </tbody>
            </Table>
        </DragDropProvider>
    );
}
