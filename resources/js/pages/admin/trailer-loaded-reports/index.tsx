import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Check,
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Wrapper from '@/components/wrapper';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import {
    create,
    destroy,
    edit,
    show,
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

    const handleDelete = () => {
        if (!confirmDelete) return;
        setIsDeleting(true);
        router.delete(destroy({ trailerLoadedReport: confirmDelete.id }), {
            onFinish: () => {
                setIsDeleting(false);
                setConfirmDelete(null);
            },
            preserveScroll: true,
        });
    };

    const handleSearch = React.useCallback(
        (value: string) => {
            setSearch(value);
            const timeout = setTimeout(() => {
                router.get(
                    '/admin/trailer-loaded-reports',
                    {
                        ...(value ? { search: value } : {}),
                        ...(filters.date ? { date: filters.date } : {}),
                    },
                    { preserveState: true },
                );
            }, 400);
            return () => clearTimeout(timeout);
        },
        [filters.date],
    );

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
                    <div className="space-y-4">
                        {reports.data.map((report) => (
                            <Card key={report.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="flex flex-col items-center">
                                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                                <span className="mt-1 text-sm font-medium">
                                                    {new Date(
                                                        report.date,
                                                    ).toLocaleDateString(
                                                        'en-GB',
                                                        {
                                                            day: '2-digit',
                                                            month: 'short',
                                                        },
                                                    )}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        report.date,
                                                    ).getFullYear()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="space-y-2">
                                                    {report.loads.map(
                                                        (load, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center gap-3"
                                                            >
                                                                <Badge
                                                                    variant={
                                                                        load.loaded
                                                                            ? 'default'
                                                                            : 'secondary'
                                                                    }
                                                                    className="flex items-center gap-1"
                                                                >
                                                                    {load.loaded ? (
                                                                        <Check className="h-3 w-3" />
                                                                    ) : (
                                                                        <X className="h-3 w-3" />
                                                                    )}
                                                                    {load.loaded
                                                                        ? 'Loaded'
                                                                        : 'Empty'}
                                                                </Badge>
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {
                                                                            load.fleet_number
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {
                                                                            load.registration_number
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                                <div className="mt-2 flex gap-2">
                                                    <Badge variant="default">
                                                        <Check className="mr-1 h-3 w-3" />
                                                        {
                                                            report.loads.filter(
                                                                (l) => l.loaded,
                                                            ).length
                                                        }{' '}
                                                        loaded
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {
                                                            report.loads.filter(
                                                                (l) =>
                                                                    !l.loaded,
                                                            ).length
                                                        }{' '}
                                                        empty
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        {can.create && (
                                            <div className="flex gap-1">
                                                <Link
                                                    href={show({
                                                        trailerLoadedReport:
                                                            report.id,
                                                    })}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={edit({
                                                        trailerLoadedReport:
                                                            report.id,
                                                    })}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        setConfirmDelete(report)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    {report.loads.some((l) => l.location) && (
                                        <div className="mt-3 border-t pt-3">
                                            <p className="text-sm text-muted-foreground">
                                                {report.loads
                                                    .map((l) => l.location)
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
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
