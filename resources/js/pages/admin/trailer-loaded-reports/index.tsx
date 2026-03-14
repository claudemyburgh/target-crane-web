import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Check,
    ChevronsLeft,
    ChevronsRight,
    Download,
    Eye,
    Loader2,
    Pencil,
    Plus,
    Search,
    Trash2,
    Truck,
    X,
} from 'lucide-react';
import * as React from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import Wrapper from '@/components/wrapper';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import {
    create,
    destroy,
    edit,
    index,
    pdf,
    show,
    singlePdf,
} from '@/routes/admin/trailer-loaded-reports';
import type { BreadcrumbItem } from '@/types';

type LoadItem = {
    fleet_number: string;
    registration_number: string;
    loaded: boolean;
    location: string;
    comment: string;
};

type Report = {
    id: number;
    date: string;
    loads: LoadItem[];
    created_at: string;
};

type Props = {
    reports: {
        data: Report[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search: string;
        date: string;
        sort: string;
        direction: string;
        per_page: number;
        page: number;
    };
    can: {
        create: boolean;
    };
};

export default function TrailerLoadedReportsIndex({
    reports,
    filters,
    can,
}: Props) {
    const [confirmDelete, setConfirmDelete] = React.useState<Report | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [search, setSearch] = React.useState(filters.search || '');

    const loadedCount = React.useMemo(
        () =>
            reports.data.reduce(
                (acc, r) => acc + r.loads.filter((l) => l.loaded).length,
                0,
            ),
        [reports.data],
    );
    const emptyCount = React.useMemo(
        () =>
            reports.data.reduce(
                (acc, r) => acc + r.loads.filter((l) => !l.loaded).length,
                0,
            ),
        [reports.data],
    );

    const handleDelete = () => {
        if (!confirmDelete) return;
        setIsDeleting(true);
        router.delete(
            destroy({ trailerLoadedReport: confirmDelete.date.split('T')[0] }),
            {
                onFinish: () => {
                    setIsDeleting(false);
                    setConfirmDelete(null);
                },
                preserveScroll: true,
            },
        );
    };

    const handleSearch = React.useCallback((value: string) => {
        setSearch(value);
        const timeout = setTimeout(() => {
            router.get(
                index({
                    mergeQuery: {
                        ...(value ? { search: value } : {}),
                        page: 1,
                    },
                }),
                {},
                { preserveState: true },
            );
        }, 400);
        return () => clearTimeout(timeout);
    }, []);

    const handlePageChange = (page: number) => {
        router.get(
            index({ mergeQuery: { ...filters, page } }),
            {},
            { preserveState: true },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/' },
        { title: 'Trailer Loaded Reports', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trailer Loaded Reports" />
            <Wrapper>
                <div className="mb-6 flex items-center justify-between">
                    <Heading
                        title="Trailer Loaded Reports"
                        description="View all trailer loaded reports"
                    />
                    <div className="flex gap-2">
                        <Link href={dashboard()}>
                            <Button variant="secondary" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    PDF
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={pdf({ mergeQuery: { days: 7 } })}
                                    >
                                        Last 7 Days
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={pdf({ mergeQuery: { days: 14 } })}
                                    >
                                        Last 14 Days
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={pdf({ mergeQuery: { days: 30 } })}
                                    >
                                        Last 30 Days
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {can.create && (
                            <Link href={create()}>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Report
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="rounded-full bg-blue-500/10 p-3">
                                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Reports
                                </p>
                                <p className="text-2xl font-bold">
                                    {reports.total}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="rounded-full bg-green-500/10 p-3">
                                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Loaded
                                </p>
                                <p className="text-2xl font-bold">
                                    {loadedCount}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="rounded-full bg-orange-500/10 p-3">
                                <X className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Empty
                                </p>
                                <p className="text-2xl font-bold">
                                    {emptyCount}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-4 flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="pl-8"
                            placeholder="Search by fleet or registration number..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>

                {reports.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Truck className="mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="text-muted-foreground">
                                No reports found.
                            </p>
                            {can.create && (
                                <Link href={create()} className="mt-4">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add First Report
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {reports.data.map((report) => (
                            <Card
                                key={report.id}
                                className="py-3 transition-shadow hover:shadow-md"
                            >
                                <div className="flex items-center justify-between px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-primary/10">
                                            <span className="text-sm leading-none font-bold">
                                                {new Date(
                                                    report.date,
                                                ).getDate()}
                                            </span>
                                            <span className="text-xs uppercase">
                                                {new Date(
                                                    report.date,
                                                ).toLocaleDateString('en-GB', {
                                                    month: 'short',
                                                })}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold">
                                                {new Date(
                                                    report.date,
                                                ).toLocaleDateString('en-GB', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {
                                                    report.loads.filter(
                                                        (l) => l.loaded,
                                                    ).length
                                                }{' '}
                                                loaded /{' '}
                                                {
                                                    report.loads.filter(
                                                        (l) => !l.loaded,
                                                    ).length
                                                }{' '}
                                                empty
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {report.loads.map((load, index) => (
                                            <div
                                                key={index}
                                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                                    load.loaded
                                                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                                                        : 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400'
                                                }`}
                                                title={`${load.fleet_number} - ${load.registration_number}`}
                                            >
                                                {load.loaded ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <X className="h-4 w-4" />
                                                )}
                                            </div>
                                        ))}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={show({
                                                            trailerLoadedReport:
                                                                report.date.split(
                                                                    'T',
                                                                )[0],
                                                        })}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="ml-2 h-8 w-8"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    View Report
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={edit({
                                                            trailerLoadedReport:
                                                                report.date.split(
                                                                    'T',
                                                                )[0],
                                                        })}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Edit Report
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() =>
                                                            setConfirmDelete(
                                                                report,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Delete Report
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {reports.last_page > 1 && (
                    <div className="mt-6 flex items-center justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationLink
                                        data-disabled={
                                            reports.current_page <= 1
                                        }
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (reports.current_page > 1)
                                                handlePageChange(1);
                                        }}
                                    >
                                        <ChevronsLeft className="text-lg" />
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationPrevious
                                        data-disabled={
                                            reports.current_page <= 1
                                        }
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (reports.current_page > 1)
                                                handlePageChange(
                                                    reports.current_page - 1,
                                                );
                                        }}
                                    />
                                </PaginationItem>
                                {(() => {
                                    const current = reports.current_page;
                                    const last = reports.last_page;
                                    const start = Math.max(1, current - 2);
                                    const end = Math.min(last, current + 2);
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
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handlePageChange(page);
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
                                        data-disabled={
                                            reports.current_page >=
                                            reports.last_page
                                        }
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (
                                                reports.current_page <
                                                reports.last_page
                                            )
                                                handlePageChange(
                                                    reports.current_page + 1,
                                                );
                                        }}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink
                                        data-disabled={
                                            reports.current_page >=
                                            reports.last_page
                                        }
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (
                                                reports.current_page <
                                                reports.last_page
                                            )
                                                handlePageChange(
                                                    reports.last_page,
                                                );
                                        }}
                                    >
                                        <ChevronsRight className="text-lg" />
                                    </PaginationLink>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}

                <Dialog
                    open={!!confirmDelete}
                    onOpenChange={(open) => !open && setConfirmDelete(null)}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Report</DialogTitle>
                        </DialogHeader>
                        <p>
                            Are you sure you want to delete this report from{' '}
                            <strong>
                                {confirmDelete &&
                                    new Date(
                                        confirmDelete.date,
                                    ).toLocaleDateString()}
                            </strong>
                            ? This action cannot be undone.
                        </p>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setConfirmDelete(null)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </Wrapper>
        </AppLayout>
    );
}
