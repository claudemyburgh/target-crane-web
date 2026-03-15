import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    ArrowLeft,
    CalendarDays,
    Check,
    Download,
    Loader2,
    Plus,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import * as React from 'react';
import Heading from '@/components/heading';
import StatSimple from '@/components/stats/stat-simple';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    EventCalendar,
    EventCalendarHeader,
    EventCalendarView,
} from '@/components/ui/event-calendar';
import type { CalendarEvent } from '@/components/ui/event-calendar';
import Wrapper from '@/components/wrapper';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import trailerLoadedReportsRoutes from '@/routes/admin/trailer-loaded-reports';

const routes = trailerLoadedReportsRoutes as any;
const { create, destroy, show, pdf } = routes;
import type { BreadcrumbItem } from '@/types';

type LoadItem = {
    fleet_number: string;
    registration_number: string;
    loaded: string;
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

export default function TrailerLoadedReportsIndex({ reports, can }: Props) {
    const [confirmDelete, setConfirmDelete] = React.useState<Report | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = React.useState(false);

    const loadedCount = React.useMemo(
        () =>
            reports.data.reduce(
                (acc, r) =>
                    acc +
                    r.loads.filter((l) => l.loaded && l.loaded !== 'Empty')
                        .length,
                0,
            ),
        [reports.data],
    );
    const emptyCount = React.useMemo(
        () =>
            reports.data.reduce(
                (acc, r) =>
                    acc +
                    r.loads.filter((l) => !l.loaded || l.loaded === 'Empty')
                        .length,
                0,
            ),
        [reports.data],
    );

    const events: CalendarEvent[] = React.useMemo(
        () =>
            reports.data.map((report) => {
                const loadedCount = report.loads.filter(
                    (l) => l.loaded && l.loaded !== 'Empty',
                ).length;
                const emptyCount = report.loads.filter(
                    (l) => !l.loaded || l.loaded === 'Empty',
                ).length;
                return {
                    id: String(report.id),
                    start: new Date(report.date),
                    end: new Date(report.date),
                    title: `${loadedCount} loaded / ${emptyCount} empty`,
                    color: 'blue' as const,
                };
            }),
        [reports.data],
    );

    const handleEventClick = (event: CalendarEvent) => {
        const report = reports.data.find((r) => String(r.id) === event.id);
        if (report) {
            router.get(
                show({
                    trailerLoadedReport: report.date.split('T')[0],
                } as unknown as Parameters<typeof show>[0]),
            );
        }
    };

    const handleAddEvent = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        router.get(create({ mergeQuery: { date: dateStr } }));
    };

    const handleDelete = () => {
        if (!confirmDelete) return;
        setIsDeleting(true);
        router.delete(
            destroy({
                trailerLoadedReport: confirmDelete.date.split('T')[0],
            } as unknown as Parameters<typeof destroy>[0]),
            {
                onSuccess: () => {
                    setIsDeleting(false);
                    setConfirmDelete(null);
                    toast.success('Report deleted successfully');
                },
                onFinish: () => {
                    setIsDeleting(false);
                    setConfirmDelete(null);
                },
                preserveScroll: true,
            },
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
                    <StatSimple
                        title="Total Reports"
                        value={reports.total}
                        icon={CalendarDays}
                    />
                    <StatSimple
                        title="Total Loaded"
                        value={loadedCount}
                        icon={Check}
                    />
                    <StatSimple
                        title="Total Empty"
                        value={emptyCount}
                        icon={X}
                    />
                </div>

                <Card className="mt-6">
                    <CardContent className="p-4">
                        <EventCalendar
                            events={events}
                            onEventClick={handleEventClick}
                            onAddEvent={handleAddEvent}
                            enableAddButton={can.create}
                        >
                            <EventCalendarHeader />
                            <EventCalendarView />
                        </EventCalendar>
                    </CardContent>
                </Card>

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
