import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Check, MapPin, Pencil, Truck, X } from 'lucide-react';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Wrapper from '@/components/wrapper';
import AppLayout from '@/layouts/app-layout';
import { edit, index } from '@/routes/admin/trailer-loaded-reports';
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

interface Props {
    report: Report;
}

export default function ShowTrailerLoadedReport({ report }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/' },
        { title: 'Trailer Loaded Reports', href: index().url },
        {
            title: new Date(report.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }),
            href: '#',
        },
    ];

    const loadedCount = report.loads.filter(
        (l) => l.loaded && l.loaded.toLowerCase() !== 'empty',
    ).length;
    const emptyCount = report.loads.filter(
        (l) => !l.loaded || l.loaded.toLowerCase() === 'empty',
    ).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trailer Loaded Report" />
            <Wrapper>
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Report -{' '}
                            {new Date(report.date).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </h1>
                        <p className="text-muted-foreground">
                            {report.loads.length} trailer
                            {report.loads.length !== 1 ? 's' : ''} in report
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={edit({ trailerLoadedReport: report.id })}>
                            <Button variant="secondary" size="sm">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Link href={index()}>
                            <Button variant="secondary" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Trailers
                            </CardTitle>
                            <Truck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {report.loads.length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Loaded
                            </CardTitle>
                            <Check className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {loadedCount}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Empty
                            </CardTitle>
                            <X className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {emptyCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Trailer Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <div className="absolute top-0 left-4 h-full w-px bg-border" />
                            <div className="space-y-6">
                                {report.loads.map((load, index) => (
                                    <div key={index} className="relative pl-10">
                                        <div className="absolute top-4 left-2 h-4 w-4 rounded-full border-2 border-background bg-primary" />
                                        <div className="rounded-lg border p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold">
                                                                {
                                                                    load.fleet_number
                                                                }
                                                            </span>
                                                            <Badge
                                                                variant={
                                                                    load.loaded &&
                                                                    load.loaded.toLowerCase() !==
                                                                        'empty'
                                                                        ? 'default'
                                                                        : 'secondary'
                                                                }
                                                            >
                                                                {load.loaded &&
                                                                load.loaded.toLowerCase() !==
                                                                    'empty' ? (
                                                                    <Check className="mr-1 h-3 w-3" />
                                                                ) : (
                                                                    <X className="mr-1 h-3 w-3" />
                                                                )}
                                                                {load.loaded ||
                                                                    'Empty'}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                load.registration_number
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                {load.location && (
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <MapPin className="h-3 w-3" />
                                                        {load.location}
                                                    </div>
                                                )}
                                            </div>
                                            {load.comment && (
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    {load.comment}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Wrapper>
        </AppLayout>
    );
}
