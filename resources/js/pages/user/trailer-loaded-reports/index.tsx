import { Head, Link, router } from '@inertiajs/react';
import { format, subMonths } from 'date-fns';
import { ArrowLeft, CalendarDays, Check, Download, X } from 'lucide-react';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import StatSimple from '@/components/stats/stat-simple';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { dashboard } from '@/routes';
import trailerReportsRoutes from '@/routes/user/trailer-reports';
import type { BreadcrumbItem } from '@/types';

const routes = trailerReportsRoutes as any;
const { show, pdf } = routes;

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
};

export default function UserTrailerReportsIndex({ reports }: Props) {
    const [dateRangeDialogOpen, setDateRangeDialogOpen] = React.useState(false);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

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

    const handleDownloadReport = () => {
        if (!dateRange?.from || !dateRange?.to) return;

        const diffTime = Math.abs(
            dateRange.to.getTime() - dateRange.from.getTime(),
        );
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (diffDays > 90) {
            toast.error('Date range cannot exceed 90 days');
            return;
        }

        const startDate = format(dateRange.from, 'yyyy-MM-dd');
        const endDate = format(dateRange.to, 'yyyy-MM-dd');
        window.location.href = pdf({
            mergeQuery: { start_date: startDate, end_date: endDate },
        }).url;
        setDateRangeDialogOpen(false);
        setDateRange(undefined);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Trailer Reports', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trailer Reports" />
            <Wrapper>
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Trailer Reports"
                        description="View all trailer loaded reports"
                    />
                    <div className="flex shrink-0 flex-wrap gap-2">
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
                                <DropdownMenuItem
                                    onClick={() => {
                                        window.location.href = pdf({
                                            mergeQuery: { days: 7 },
                                        }).url;
                                    }}
                                >
                                    Last 7 Days
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        window.location.href = pdf({
                                            mergeQuery: { days: 14 },
                                        }).url;
                                    }}
                                >
                                    Last 14 Days
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        window.location.href = pdf({
                                            mergeQuery: { days: 30 },
                                        }).url;
                                    }}
                                >
                                    Last 30 Days
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setDateRangeDialogOpen(true)}
                        >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            Custom Date
                        </Button>
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
                    <CardContent className="p-2 sm:p-4">
                        <EventCalendar
                            events={events}
                            onEventClick={handleEventClick}
                        >
                            <EventCalendarHeader />
                            <EventCalendarView />
                        </EventCalendar>
                    </CardContent>
                </Card>

                <Dialog
                    open={dateRangeDialogOpen}
                    onOpenChange={(open) => {
                        setDateRangeDialogOpen(open);
                        if (!open) setDateRange(undefined);
                    }}
                >
                    <DialogContent
                        className="w-full"
                        style={{ width: '600px', maxWidth: '600px' }}
                    >
                        <DialogHeader>
                            <DialogTitle>Download Report</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center py-4">
                            <Calendar
                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                defaultMonth={subMonths(new Date(), 1)}
                                disabled={(date) => date > new Date()}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setDateRangeDialogOpen(false);
                                    setDateRange(undefined);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDownloadReport}
                                disabled={!dateRange?.from || !dateRange?.to}
                            >
                                Download
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </Wrapper>
        </AppLayout>
    );
}
