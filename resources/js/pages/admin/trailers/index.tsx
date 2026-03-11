import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    ArrowUpDown,
    ChevronsLeft,
    ChevronsRight,
    Eye,
    MoreVertical,
    Pencil,
    RotateCcw,
    Search,
    Trash2,
    Truck,
    X,
} from 'lucide-react';
import * as React from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Wrapper from '@/components/wrapper';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Badge } from '@/components/ui/badge';
import { usePaginationStore } from '@/store/use-pagination-store';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import {
    bulk as bulkRoute,
    create,
    destroy,
    edit,
    forceDelete,
    index as trailersIndex,
    restore,
    show,
} from '@/routes/admin/trailers';
import type { BreadcrumbItem } from '@/types';

type Trailer = {
    id: number;
    fleet_number: string;
    registration_number: string;
    brand_name: string;
    axles_amount: number;
    license_expiry_date: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
};

export default function AdminTrailersIndex({
    trailers,
    filters,
    brands = [],
    can,
}: {
    trailers: any;
    filters: any;
    brands: string[];
    can: any;
}) {
    const { getPerPage, setPerPage } = usePaginationStore();
    const currentPath =
        typeof window !== 'undefined'
            ? window.location.pathname
            : '/admin/trailers';

    const [localFilters, setLocalFilters] = React.useState({
        search: filters?.search ?? '',
        status: filters?.status ?? '',
        brand: filters?.brand ?? '',
        sort: filters?.sort ?? 'created_at',
        direction: filters?.direction ?? 'desc',
        page: filters?.page ?? 1,
        per_page: filters?.per_page ?? getPerPage(currentPath, 25),
    });

    const data = React.useMemo(() => trailers?.data ?? [], [trailers?.data]);

    const [rowSelection, setRowSelection] = React.useState<
        Record<string, boolean>
    >({});

    const [confirmDeleteTrailer, setConfirmDeleteTrailer] =
        React.useState<Trailer | null>(null);
    const [confirmBulkDelete, setConfirmBulkDelete] = React.useState(false);

    const columns = React.useMemo<ColumnDef<Trailer>[]>(
        () => [
            {
                id: 'select',
                header: () => (
                    <div className="w-px">
                        <Checkbox
                            checked={
                                Object.keys(rowSelection).length ===
                                    data.length && data.length > 0
                            }
                            onCheckedChange={(checked) => {
                                const next: Record<string, boolean> = {};
                                if (checked) {
                                    for (const t of data) next[t.id] = true;
                                }
                                setRowSelection(next);
                            }}
                        />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="w-px">
                        <Checkbox
                            checked={rowSelection[(row.original as Trailer).id]}
                            onCheckedChange={(c) => {
                                const id = (row.original as Trailer).id;
                                setRowSelection((s) => ({ ...s, [id]: !!c }));
                            }}
                        />
                    </div>
                ),
                size: 32,
            },
            {
                id: 'fleet_number',
                header: () => (
                    <div className="flex items-center gap-1">
                        <span>Fleet #</span>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            aria-label="Sort by fleet number"
                            onClick={() => {
                                const direction =
                                    localFilters.direction === 'asc'
                                        ? 'desc'
                                        : 'asc';
                                submitFilters({
                                    sort: 'fleet_number',
                                    direction,
                                    page: 1,
                                });
                            }}
                        >
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                ),
                cell: ({ row }) => (
                    <span className="font-medium">
                        {row.original.fleet_number}
                    </span>
                ),
            },
            {
                accessorKey: 'registration_number',
                header: () => (
                    <div className="flex items-center gap-1">
                        <span>Registration</span>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            aria-label="Sort by registration"
                            onClick={() => {
                                const direction =
                                    localFilters.direction === 'asc'
                                        ? 'desc'
                                        : 'asc';
                                submitFilters({
                                    sort: 'registration_number',
                                    direction,
                                    page: 1,
                                });
                            }}
                        >
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                ),
            },
            {
                accessorKey: 'brand_name',
                header: () => (
                    <div className="flex items-center gap-1">
                        <span>Brand</span>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            aria-label="Sort by brand"
                            onClick={() => {
                                const direction =
                                    localFilters.direction === 'asc'
                                        ? 'desc'
                                        : 'asc';
                                submitFilters({
                                    sort: 'brand_name',
                                    direction,
                                    page: 1,
                                });
                            }}
                        >
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                ),
            },
            {
                accessorKey: 'axles_amount',
                header: 'Axles',
            },
            {
                accessorKey: 'license_expiry_date',
                header: () => (
                    <div className="flex items-center gap-1">
                        <span>License Expiry</span>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            aria-label="Sort by license expiry"
                            onClick={() => {
                                const direction =
                                    localFilters.direction === 'asc'
                                        ? 'desc'
                                        : 'asc';
                                submitFilters({
                                    sort: 'license_expiry_date',
                                    direction,
                                    page: 1,
                                });
                            }}
                        >
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                ),
                cell: ({ row }) => {
                    const expiryDate = new Date(
                        row.original.license_expiry_date,
                    );
                    const today = new Date();
                    const isExpired = expiryDate < today;
                    const isExpiringSoon =
                        !isExpired &&
                        expiryDate <
                            new Date(
                                today.getTime() + 30 * 24 * 60 * 60 * 1000,
                            );

                    let variant:
                        | 'default'
                        | 'secondary'
                        | 'destructive'
                        | 'outline' = 'outline';
                    if (isExpired) variant = 'destructive';
                    else if (isExpiringSoon) variant = 'secondary';

                    return (
                        <Badge variant={variant}>
                            {expiryDate.toLocaleDateString()}
                        </Badge>
                    );
                },
            },
            {
                id: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const t = row.original as Trailer;
                    if (t.deleted_at) {
                        return <Badge variant="destructive">Deleted</Badge>;
                    }
                    return <Badge variant="default">Active</Badge>;
                },
            },
            {
                id: 'actions',
                header: () => <span className="sr-only">Actions</span>,
                cell: ({ row }) => {
                    const t = row.original as Trailer;
                    return (
                        <div className="flex min-w-0 justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        aria-label="Actions"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="min-w-44"
                                >
                                    <DropdownMenuItem
                                        onClick={() => router.get(show(t.id))}
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
                                    </DropdownMenuItem>
                                    {can?.edit && !t.deleted_at && (
                                        <DropdownMenuItem
                                            onClick={() =>
                                                router.get(edit(t.id))
                                            }
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                    )}
                                    {can?.delete && !t.deleted_at && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setConfirmDeleteTrailer(t)
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete…
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    {can?.delete && t.deleted_at && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    router.post(
                                                        restore(t.id),
                                                        {},
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                            >
                                                <RotateCcw className="mr-2 h-4 w-4" />
                                                Restore
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    router.delete(
                                                        forceDelete(t.id),
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Permanently Delete
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                },
            },
        ],
        [data, rowSelection, can, localFilters.direction],
    );

    const table = useReactTable({
        data,
        columns,
        state: { rowSelection },
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
    });

    const selectedIds = React.useMemo(
        () =>
            Object.entries(rowSelection)
                .filter(([, v]) => v)
                .map(([k]) => Number(k)),
        [rowSelection],
    );

    const normalize = (f: typeof localFilters) => {
        const serverDefaultPer = 25;
        const brand = f.brand === 'any' ? '' : f.brand;
        const status = f.status === 'any' ? '' : f.status;
        const sort = f.sort || undefined;
        const direction =
            sort && f.direction !== 'asc' ? f.direction : undefined;

        return {
            search: f.search || undefined,
            status: status || undefined,
            brand: brand || undefined,
            page: f.page && f.page !== 1 ? f.page : undefined,
            per_page:
                f.per_page && f.per_page !== serverDefaultPer
                    ? f.per_page
                    : undefined,
            sort,
            direction,
        } as Record<string, any>;
    };

    const clearFilter = (key: 'search' | 'status' | 'brand') => {
        setLocalFilters((f) => ({ ...f, [key]: '', page: 1 }));
    };

    const initialSearch = React.useRef(true);
    React.useEffect(() => {
        if (initialSearch.current) {
            initialSearch.current = false;
            return;
        }
        const id = setTimeout(() => submitFilters(), 400);
        return () => clearTimeout(id);
    }, [localFilters.search]);

    const submitFilters = (
        arg?: React.FormEvent | Partial<typeof localFilters>,
    ) => {
        let next: Partial<typeof localFilters> = {};
        if (arg && 'preventDefault' in arg) {
            (arg as React.FormEvent).preventDefault();
        } else if (arg) {
            next = arg as Partial<typeof localFilters>;
        }
        const params = normalize({
            ...(localFilters as typeof localFilters),
            ...next,
        });
        router.get(trailersIndex(), params as Record<string, any>, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    React.useEffect(() => {
        submitFilters();
    }, [
        localFilters.per_page,
        localFilters.status,
        localFilters.brand,
        localFilters.sort,
        localFilters.direction,
    ]);

    const bulk = (action: string) => {
        if (selectedIds.length === 0) return;
        router.post(
            bulkRoute(),
            { action, ids: selectedIds },
            { preserveScroll: true },
        );
    };

    const doDelete = () => {
        if (!confirmDeleteTrailer) return;
        router.delete(destroy(confirmDeleteTrailer.id), {
            onSuccess: () => setConfirmDeleteTrailer(null),
            preserveScroll: true,
        });
    };

    const clearSelection = () => setRowSelection({});

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: dashboard() },
        { title: 'Trailers', href: trailersIndex() },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trailers" />
            <Wrapper>
                <Heading
                    title="Trailers"
                    description="Manage your fleet trailers. Track registration, license expiry, and fleet details."
                    variant="default"
                    action={
                        can?.create ? (
                            <Link href={create()}>
                                <Button size="sm">
                                    <Truck className="mr-0 h-4 w-4" />
                                    Add Trailer
                                </Button>
                            </Link>
                        ) : null
                    }
                />

                {/* Filter toolbar */}
                <div className="mb-3 flex flex-wrap items-end gap-2">
                    {/* Search */}
                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="h-9 w-72 pl-8"
                            placeholder="Search fleet or registration"
                            value={localFilters.search}
                            type="search"
                            onChange={(e) =>
                                setLocalFilters((f) => ({
                                    ...f,
                                    search: e.target.value,
                                }))
                            }
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <Select
                            value={localFilters.status}
                            onValueChange={(v) =>
                                setLocalFilters((f) => ({
                                    ...f,
                                    status: v,
                                    page: 1,
                                }))
                            }
                        >
                            <SelectTrigger className="h-9 min-w-32">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="deleted">Deleted</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Brand */}
                    <div>
                        <Select
                            value={localFilters.brand}
                            onValueChange={(v) =>
                                setLocalFilters((f) => ({
                                    ...f,
                                    brand: v,
                                    page: 1,
                                }))
                            }
                        >
                            <SelectTrigger className="h-9 min-w-32">
                                <SelectValue placeholder="Brand" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any brand</SelectItem>
                                {brands.map((r: string) => (
                                    <SelectItem key={r} value={r}>
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Reset button */}
                    <Button
                        className="ml-0 h-9"
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            const defaultPerPage = getPerPage(currentPath, 25);
                            const reset = {
                                search: '',
                                status: '',
                                brand: '',
                                page: 1,
                                per_page: defaultPerPage,
                                sort: 'created_at',
                                direction: 'desc',
                            } as typeof localFilters;
                            setLocalFilters(reset);
                            submitFilters(reset);
                        }}
                    >
                        <X className="size-4" />
                        <span className="sr-only">Reset</span>
                    </Button>

                    {/* Spacer */}
                    <div className="grow" />

                    {/* Per page */}
                    <div>
                        <Select
                            value={String(localFilters.per_page)}
                            onValueChange={(v) => {
                                const val = Number(v || 25);
                                setPerPage(currentPath, val);
                                setLocalFilters((f) => ({
                                    ...f,
                                    per_page: val,
                                    page: 1,
                                }));
                            }}
                        >
                            <SelectTrigger className="h-9 min-w-28">
                                <SelectValue placeholder="Per page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Active filters */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    {localFilters.search && (
                        <Badge variant="secondary" className="pr-1">
                            Search: {localFilters.search}
                            <Button
                                size="icon"
                                variant="ghost"
                                className="ml-1 h-5 w-5"
                                onClick={() => clearFilter('search')}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {localFilters.status && localFilters.status !== 'any' && (
                        <Badge variant="secondary" className="pr-1">
                            Status: {localFilters.status}
                            <Button
                                size="icon"
                                variant="ghost"
                                className="ml-1 h-5 w-5"
                                onClick={() => clearFilter('status')}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {localFilters.brand && localFilters.brand !== 'any' && (
                        <Badge variant="secondary" className="pr-1">
                            Brand: {localFilters.brand}
                            <Button
                                size="icon"
                                variant="ghost"
                                className="ml-1 h-5 w-5"
                                onClick={() => clearFilter('brand')}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {!localFilters.search &&
                        (!localFilters.status ||
                            localFilters.status === 'any') &&
                        (!localFilters.brand ||
                            localFilters.brand === 'any') && (
                            <span className="text-sm text-muted-foreground">
                                No active filters
                            </span>
                        )}
                </div>

                {/* Bulk actions */}
                {selectedIds.length > 0 && (
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        <div className="text-sm">
                            Selected: {selectedIds.length}
                        </div>
                        {can?.delete && (
                            <>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => setConfirmBulkDelete(true)}
                                >
                                    Delete
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => bulk('restore')}
                                >
                                    Restore
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => bulk('force-delete')}
                                >
                                    Permanently Delete
                                </Button>
                            </>
                        )}
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={clearSelection}
                        >
                            Clear
                        </Button>
                    </div>
                )}

                {/* Table */}
                <div className="w-full overflow-x-auto rounded border">
                    <table className="w-full">
                        <thead>
                            {table.getHeaderGroups().map((hg) => (
                                <tr key={hg.id}>
                                    {hg.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={
                                            table.getAllLeafColumns().length
                                        }
                                        className="p-6"
                                    >
                                        <Empty className="border">
                                            <EmptyHeader>
                                                <EmptyMedia variant="icon">
                                                    <Truck className="size-5" />
                                                </EmptyMedia>
                                                <EmptyTitle>
                                                    No trailers found
                                                </EmptyTitle>
                                                <EmptyDescription>
                                                    Try adjusting your filters
                                                    or clearing them to see more
                                                    results.
                                                </EmptyDescription>
                                            </EmptyHeader>
                                        </Empty>
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="border-t">
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="px-3 py-2 text-sm"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-0 flex items-center justify-center gap-2">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationLink
                                    aria-label="First"
                                    href={
                                        trailersIndex({
                                            mergeQuery: {
                                                ...normalize(localFilters),
                                                page: 1,
                                            },
                                        }).url
                                    }
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setLocalFilters((f) => ({
                                            ...f,
                                            page: 1,
                                        }));
                                        submitFilters({ page: 1 });
                                    }}
                                    data-disabled={trailers?.current_page <= 1}
                                >
                                    <ChevronsLeft className="text-lg" />
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationPrevious
                                    href={
                                        trailersIndex({
                                            mergeQuery: {
                                                ...normalize(localFilters),
                                                page: Math.max(
                                                    1,
                                                    (trailers?.current_page ??
                                                        1) - 1,
                                                ),
                                            },
                                        }).url
                                    }
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const page = Math.max(
                                            1,
                                            (trailers?.current_page ?? 1) - 1,
                                        );
                                        setLocalFilters((f) => ({
                                            ...f,
                                            page,
                                        }));
                                        submitFilters({ page });
                                    }}
                                    data-disabled={trailers?.current_page <= 1}
                                />
                            </PaginationItem>
                            {(() => {
                                const current = trailers?.current_page ?? 1;
                                const last = trailers?.last_page ?? 1;
                                const start = Math.max(1, current - 3);
                                const end = Math.min(last, current + 3);
                                const pages: number[] = [];
                                for (let p = start; p <= end; p++)
                                    pages.push(p);
                                const items = [] as React.ReactNode[];
                                if (start > 1) {
                                    items.push(
                                        <PaginationItem key="start-ellipsis">
                                            <PaginationEllipsis />
                                        </PaginationItem>,
                                    );
                                }
                                for (const page of pages) {
                                    items.push(
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                isActive={page === current}
                                                href={
                                                    trailersIndex({
                                                        mergeQuery: {
                                                            ...normalize(
                                                                localFilters,
                                                            ),
                                                            page,
                                                        },
                                                    }).url
                                                }
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setLocalFilters((f) => ({
                                                        ...f,
                                                        page,
                                                    }));
                                                    submitFilters({ page });
                                                }}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>,
                                    );
                                }
                                if (end < last) {
                                    items.push(
                                        <PaginationItem key="end-ellipsis">
                                            <PaginationEllipsis />
                                        </PaginationItem>,
                                    );
                                }
                                return items;
                            })()}
                            <PaginationItem>
                                <PaginationNext
                                    href={
                                        trailersIndex({
                                            mergeQuery: {
                                                ...normalize(localFilters),
                                                page: Math.min(
                                                    trailers?.last_page ?? 1,
                                                    (trailers?.current_page ??
                                                        1) + 1,
                                                ),
                                            },
                                        }).url
                                    }
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const last = trailers?.last_page ?? 1;
                                        const page = Math.min(
                                            last,
                                            (trailers?.current_page ?? 1) + 1,
                                        );
                                        setLocalFilters((f) => ({
                                            ...f,
                                            page,
                                        }));
                                        submitFilters({ page });
                                    }}
                                    data-disabled={
                                        trailers?.current_page >=
                                        trailers?.last_page
                                    }
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink
                                    aria-label="Last"
                                    href={
                                        trailersIndex({
                                            mergeQuery: {
                                                ...normalize(localFilters),
                                                page: trailers?.last_page ?? 1,
                                            },
                                        }).url
                                    }
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const page = trailers?.last_page ?? 1;
                                        setLocalFilters((f) => ({
                                            ...f,
                                            page,
                                        }));
                                        submitFilters({ page });
                                    }}
                                    data-disabled={
                                        trailers?.current_page >=
                                        trailers?.last_page
                                    }
                                >
                                    <ChevronsRight className="text-lg" />
                                </PaginationLink>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={!!confirmDeleteTrailer}
                    onOpenChange={(open) =>
                        !open && setConfirmDeleteTrailer(null)
                    }
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Trailer</DialogTitle>
                        </DialogHeader>
                        <p>
                            Are you sure you want to delete trailer{' '}
                            <strong>
                                {confirmDeleteTrailer?.fleet_number}
                            </strong>
                            ? This action can be undone by restoring the
                            trailer.
                        </p>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setConfirmDeleteTrailer(null)}
                            >
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={doDelete}>
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Bulk Delete Confirmation Dialog */}
                <Dialog
                    open={confirmBulkDelete}
                    onOpenChange={(open) =>
                        !open && setConfirmBulkDelete(false)
                    }
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Selected Trailers</DialogTitle>
                        </DialogHeader>
                        <p>
                            Are you sure you want to delete {selectedIds.length}{' '}
                            selected trailer(s)? This action can be undone by
                            restoring.
                        </p>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setConfirmBulkDelete(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    bulk('delete');
                                    setConfirmBulkDelete(false);
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </Wrapper>
        </AppLayout>
    );
}
