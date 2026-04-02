import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Wrapper from '@/components/wrapper';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

type Props = {
    latestReport?: Report;
};

// @ts-expect-error
export default function Dashboard({ latestReport }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Wrapper>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {latestReport ? (
                            <div className="flex h-full flex-col overflow-auto p-4">
                                <div className="mb-3 shrink-0">
                                    <h3 className="text-lg font-semibold">
                                        Latest Trailer Report
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {format(
                                            new Date(latestReport.date),
                                            'MMMM d, yyyy',
                                        )}
                                    </p>
                                </div>
                                <div className="flex-1 overflow-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Fleet #</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Location</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {latestReport.loads
                                                .slice(0, 10)
                                                .map((load, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell className="font-medium">
                                                            {load.fleet_number}
                                                        </TableCell>
                                                        <TableCell>
                                                            {load.loaded || 'Not Loaded'}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {load.location}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                    {latestReport.loads.length > 10 && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Showing 10 of{' '}
                                            {latestReport.loads.length} trailers
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        )}
                    </div>
                    <div className="relative  overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative  overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>

                <div className="relative min-h-screen flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </Wrapper>
        </AppLayout>
    );
}
