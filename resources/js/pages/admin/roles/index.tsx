import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    ChevronsLeft,
    ChevronsRight,
    Eye,
    MoreVertical,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Shield,
    Trash2,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import * as React from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
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
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import { create, destroy, edit, index, show } from '@/routes/admin/roles';
import { usePaginationStore } from '@/store/use-pagination-store';
import type { BreadcrumbItem } from '@/types';

type Role = {
    id: number;
    name: string;
    guard_name: string;
    permissions_count?: number;
    deleted_at?: string | null;
};

export default function RolesIndex({
    roles,
    filters,
    can,
}: {
    roles: any;
    filters: any;
    can: any;
}) {
    const { getPerPage, setPerPage } = usePaginationStore();
    const currentPath =
        typeof window !== 'undefined'
            ? window.location.pathname
            : '/admin/roles';

    const [localFilters, setLocalFilters] = React.useState({
        search: filters?.search ?? '',
        page: filters?.page ?? 1,
        per_page: filters?.per_page ?? getPerPage(currentPath, 25),
    });

    const data = React.useMemo(() => roles?.data ?? [], [roles?.data]);
    const [rowSelection, setRowSelection] = React.useState<
        Record<string, boolean>
    >({});

    const [confirmDelete, setConfirmDelete] = React.useState<Role | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const columns = React.useMemo<ColumnDef<Role>[]>(
        () => [
            {
                id: 'select',
                header: () => (
                    <div className="w-2">
                        <Checkbox
                            checked={
                                Object.keys(rowSelection).length ===
                                    data.length && data.length > 0
                            }
                            onCheckedChange={(checked) => {
                                const next: Record<string, boolean> = {};
                                if (checked) {
                                    for (const r of data) next[r.id] = true;
                                }
                                setRowSelection(next);
                            }}
                        />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="w-px">
                        <Checkbox
                            checked={rowSelection[(row.original as Role).id]}
                            onCheckedChange={(c) => {
                                const id = (row.original as Role).id;
                                setRowSelection((s) => ({ ...s, [id]: !!c }));
                            }}
                        />
                    </div>
                ),
                size: 32,
            },
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Shield className="text-muted-foreground h-4 w-4" />
                        <span className="font-medium capitalize">
                            {row.original.name}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'guard_name',
                header: 'Guard',
                cell: ({ row }) => (
                    <Badge variant="secondary">{row.original.guard_name}</Badge>
                ),
            },
            {
                accessorKey: 'permissions_count',
                header: 'Permissions',
                cell: ({ row }) => {
                    const count = row.original.permissions_count ?? 0;
                    return (
                        <Badge variant="outline" className="capitalize">
                            {count} permission{count !== 1 ? 's' : ''}
                        </Badge>
                    );
                },
            },
            {
                id: 'status',
                header: 'Status',
                cell: ({ row }) =>
                    row.original.deleted_at ? (
                        <Badge variant="destructive">Deleted</Badge>
                    ) : (
                        <Badge variant="outline">Active</Badge>
                    ),
            },
            {
                id: 'actions',
                header: () => <span className="sr-only">Actions</span>,
                cell: ({ row }) => {
                    const r = row.original as Role;
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
                                    className="min-w-40"
                                >
                                    <DropdownMenuItem
                                        onClick={() => router.get(show(r.id))}
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
                                    </DropdownMenuItem>
                                    {can?.edit && !r.deleted_at && (
                                        <DropdownMenuItem
                                            onClick={() =>
                                                router.get(edit(r.id))
                                            }
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                    )}
                                    {can?.delete && !r.deleted_at && (
                                        <DropdownMenuItem
                                            onClick={() => setConfirmDelete(r)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete…
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                },
            },
        ],
        [data, rowSelection, can],
    );

    const selectedIds = React.useMemo(
        () =>
            Object.entries(rowSelection)
                .filter(([, v]) => v)
                .map(([k]) => Number(k)),
        [rowSelection],
    );

    const normalize = React.useCallback((f: typeof localFilters) => {
        const serverDefaultPer = 25;
        const filterParams: Record<string, any> = {};
        if (f.search) {
            filterParams.search = f.search;
        }
        return {
            ...(Object.keys(filterParams).length > 0
                ? { filter: filterParams }
                : {}),
            page: f.page && f.page !== 1 ? f.page : undefined,
            per_page:
                f.per_page && f.per_page !== serverDefaultPer
                    ? f.per_page
                    : undefined,
        } as Record<string, any>;
    }, []);

    const localFiltersRef = React.useRef(localFilters);
    React.useEffect(() => {
        localFiltersRef.current = localFilters;
    }, [localFilters]);

    const submitFilters = React.useCallback(
        (arg?: React.FormEvent | Partial<typeof localFilters>) => {
            let next: Partial<typeof localFilters> = {};
            if (arg && 'preventDefault' in arg) {
                (arg as React.FormEvent).preventDefault();
            } else if (arg) {
                next = arg as Partial<typeof localFilters>;
            }
            const params = normalize({
                ...localFiltersRef.current,
                ...next,
            });
            router.get(index(), params as Record<string, any>, {
                preserveState: true,
                preserveScroll: true,
            });
        },
        [normalize],
    );

    const initialSearch = React.useRef(true);
    React.useEffect(() => {
        if (initialSearch.current) {
            initialSearch.current = false;
            return;
        }
        const id = setTimeout(() => submitFilters(), 400);
        return () => clearTimeout(id);
    }, [localFilters.search, submitFilters]);

    React.useEffect(() => {
        submitFilters();
    }, [localFilters.per_page, localFilters.page, submitFilters]);

    const handleDelete = () => {
        if (!confirmDelete) return;
        setIsDeleting(true);
        router.delete(destroy(confirmDelete.id), {
            onSuccess: () => {
                setConfirmDelete(null);
                toast.success('Role deleted successfully');
            },
            onFinish: () => setIsDeleting(false),
            preserveScroll: true,
        });
    };

    const clearSelection = () => setRowSelection({});

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: dashboard() },
        { title: 'Roles', href: index() },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <Wrapper>
                <Heading
                    title="Roles"
                    description="Manage roles and their permissions. Use filters to quickly find roles."
                    variant="default"
                    action={
                        can?.create ? (
                            <Link href={create()}>
                                <Button size="sm">
                                    <Plus className="mr-0 h-4 w-4" />
                                    Create Role
                                </Button>
                            </Link>
                        ) : null
                    }
                />

                <div className="mb-3 flex flex-wrap items-end gap-2">
                    <div className="relative">
                        <Search className="text-muted-foreground pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" />
                        <Input
                            className="h-9 w-72 pl-8"
                            placeholder="Search roles"
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

                    <Button
                        className="ml-0 h-9"
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            const defaultPerPage = getPerPage(currentPath, 25);
                            const reset = {
                                search: '',
                                page: 1,
                                per_page: defaultPerPage,
                            } as typeof localFilters;
                            setLocalFilters(reset);
                            submitFilters(reset);
                        }}
                    >
                        <X className={`size-4`} />
                        <span className={`sr-only`}>Reset</span>
                    </Button>

                    <div className="grow" />

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

                <div className="mb-4 flex flex-wrap items-center gap-2">
                    {localFilters.search && (
                        <Badge variant="secondary" className="pr-1">
                            Search: {localFilters.search}
                            <Button
                                size="icon"
                                variant="ghost"
                                className="ml-1 h-5 w-5"
                                onClick={() =>
                                    setLocalFilters((f) => ({
                                        ...f,
                                        search: '',
                                        page: 1,
                                    }))
                                }
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                </div>

                {selectedIds.length > 0 && can?.delete && (
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        <div className="text-sm">
                            Selected: {selectedIds.length}
                        </div>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={clearSelection}
                        >
                            Clear
                        </Button>
                    </div>
                )}

                <DataTable
                    columns={columns}
                    data={data}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                    emptyMessage="No roles found"
                />

                {(roles?.last_page ?? 1) > 1 && (
                    <div className="mt-0 flex items-center justify-center gap-2">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationLink
                                        aria-label="First"
                                        href={
                                            index({
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
                                        data-disabled={roles?.current_page <= 1}
                                    >
                                        <ChevronsLeft className={`text-lg`} />
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={
                                            index({
                                                mergeQuery: {
                                                    ...normalize(localFilters),
                                                    page: Math.max(
                                                        1,
                                                        (roles?.current_page ??
                                                            1) - 1,
                                                    ),
                                                },
                                            }).url
                                        }
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const page = Math.max(
                                                1,
                                                (roles?.current_page ?? 1) - 1,
                                            );
                                            setLocalFilters((f) => ({
                                                ...f,
                                                page,
                                            }));
                                            submitFilters({ page });
                                        }}
                                        data-disabled={roles?.current_page <= 1}
                                    />
                                </PaginationItem>
                                {(() => {
                                    const current = roles?.current_page ?? 1;
                                    const last = roles?.last_page ?? 1;
                                    const start = Math.max(1, current - 3);
                                    const end = Math.min(last, current + 3);
                                    const pages: number[] = [];
                                    for (let p = start; p <= end; p++)
                                        pages.push(p);
                                    const items = [] as React.ReactNode[];
                                    if (start > 1) {
                                        items.push(
                                            <PaginationItem key="start-ellipsis">
                                                <span className="flex h-9 w-9 items-center justify-center">
                                                    ...
                                                </span>
                                            </PaginationItem>,
                                        );
                                    }
                                    for (const page of pages) {
                                        items.push(
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    isActive={page === current}
                                                    href={
                                                        index({
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
                                                        setLocalFilters(
                                                            (f) => ({
                                                                ...f,
                                                                page,
                                                            }),
                                                        );
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
                                                <span className="flex h-9 w-9 items-center justify-center">
                                                    ...
                                                </span>
                                            </PaginationItem>,
                                        );
                                    }
                                    return items;
                                })()}
                                <PaginationItem>
                                    <PaginationNext
                                        href={
                                            index({
                                                mergeQuery: {
                                                    ...normalize(localFilters),
                                                    page: Math.min(
                                                        roles?.last_page ?? 1,
                                                        (roles?.current_page ??
                                                            1) + 1,
                                                    ),
                                                },
                                            }).url
                                        }
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const page = Math.min(
                                                roles?.last_page ?? 1,
                                                (roles?.current_page ?? 1) + 1,
                                            );
                                            setLocalFilters((f) => ({
                                                ...f,
                                                page,
                                            }));
                                            submitFilters({ page });
                                        }}
                                        data-disabled={
                                            (roles?.current_page ?? 1) >=
                                            (roles?.last_page ?? 1)
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </Wrapper>

            {confirmDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setConfirmDelete(null)}
                >
                    <div
                        className="bg-background w-full max-w-md rounded-lg p-6 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="mb-2 text-lg font-semibold">
                            Delete Role
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Are you sure you want to delete the role "
                            {confirmDelete.name}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => setConfirmDelete(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
