import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { router } from '@inertiajs/react';
import type { ColumnDef, OnChangeFn, Row, RowSelectionState } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { GripVertical, Search } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface SortableRowProps<T> {
    row: Row<T>;
    children: React.ReactNode;
}

function SortableRow<T extends { id: number }>({
    row,
    children,
}: SortableRowProps<T>) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: String(row.original.id),
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell className="p-0">
                <div className="w-px">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-grab active:cursor-grabbing"
                        {...listeners}
                        {...attributes}
                    >
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            </TableCell>
            {children}
        </TableRow>
    );
}

interface DataTableProps<T extends { id: number }> {
    columns: ColumnDef<T, unknown>[];
    data: T[];
    rowSelection: Record<string, boolean>;
    onRowSelectionChange: OnChangeFn<RowSelectionState>;
    bulkRoute?: () => unknown;
    onReorder?: (newOrder: T[]) => void;
    emptyMessage?: string;
    emptyIcon?: React.ReactNode;
    reorderable?: boolean;
}

export function DataTable<T extends { id: number }>({
    columns,
    data,
    rowSelection,
    onRowSelectionChange,
    bulkRoute,
    onReorder,
    emptyMessage = 'No results found',
    emptyIcon,
    reorderable = false,
}: DataTableProps<T>) {
    const [orderedData, setOrderedData] = React.useState<T[]>(data);

    React.useEffect(() => {
        setOrderedData(data);
    }, [data]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setOrderedData((items) => {
                const oldIndex = items.findIndex(
                    (item) => String(item.id) === active.id,
                );
                const newIndex = items.findIndex(
                    (item) => String(item.id) === over.id,
                );

                if (oldIndex === -1 || newIndex === -1) return items;

                const newItems = [...items];
                const [movedItem] = newItems.splice(oldIndex, 1);
                newItems.splice(newIndex, 0, movedItem);

                if (bulkRoute && onReorder) {
                    const orderedIds = newItems.map((item) => item.id);
                    router.post(
                        bulkRoute() as string,
                        { action: 'reorder', ids: orderedIds },
                        { preserveScroll: true },
                    );
                }

                onReorder?.(newItems);

                return newItems;
            });
        }
    };

    const table = useReactTable({
        data: orderedData,
        columns,
        state: { rowSelection },
        onRowSelectionChange,
        getCoreRowModel: getCoreRowModel(),
    });

    const renderTable = (isSortable: boolean) => (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                        {isSortable && (
                            <TableHead className="w-10" />
                        )}
                        {hg.headers.map((header) => (
                            <TableHead
                                key={header.id}
                                className="text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                            >
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext(),
                                      )}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                    <TableRow>
                        <TableCell
                            colSpan={
                                table.getAllLeafColumns().length + (isSortable ? 1 : 0)
                            }
                            className="h-24 text-center"
                        >
                            <div className="flex flex-col items-center justify-center gap-2 py-8">
                                {emptyIcon ?? (
                                    <Search className="size-5 text-muted-foreground" />
                                )}
                                <p className="text-sm font-medium">
                                    {emptyMessage}
                                </p>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : isSortable ? (
                    <SortableContext
                        items={orderedData.map((item) => String(item.id))}
                        strategy={verticalListSortingStrategy}
                    >
                        {table.getRowModel().rows.map((row) => (
                            <SortableRow key={row.id} row={row}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </SortableRow>
                        ))}
                    </SortableContext>
                ) : (
                    table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );

    const showSortable = reorderable && bulkRoute;

    if (showSortable) {
        return (
            <div className="w-full overflow-x-auto rounded border">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    {renderTable(true)}
                </DndContext>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto rounded border">
            {renderTable(false)}
        </div>
    );
}
