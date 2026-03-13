import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Wrapper from '@/components/wrapper';
import AppLayout from '@/layouts/app-layout';
import { index, store } from '@/routes/admin/trailer-loaded-reports';
import type { BreadcrumbItem } from '@/types';

type LoadItem = {
    trailer_id: string;
    fleet_number: string;
    registration_number: string;
    loaded: string;
    location: string;
    comment: string;
};

type Trailer = {
    id: number;
    fleet_number: string;
    registration_number: string;
};

interface Props {
    trailers: Trailer[];
}

export default function CreateTrailerLoadedReport({ trailers }: Props) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [date, setDate] = React.useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    const initialLoads: LoadItem[] = trailers.map((trailer) => ({
        trailer_id: trailer.id.toString(),
        fleet_number: trailer.fleet_number,
        registration_number: trailer.registration_number,
        loaded: '',
        location: '',
        comment: '',
    }));

    const [loads, setLoads] = React.useState<LoadItem[]>(initialLoads);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const getAvailableTrailers = (currentIndex: number) => {
        const selectedTrailerIds = loads
            .map((load, index) =>
                index !== currentIndex ? load.trailer_id : null,
            )
            .filter(Boolean);
        return trailers.filter(
            (t) => !selectedTrailerIds.includes(t.id.toString()),
        );
    };

    const addRow = () => {
        setLoads([
            ...loads,
            {
                trailer_id: '',
                fleet_number: '',
                registration_number: '',
                loaded: '',
                location: '',
                comment: '',
            },
        ]);
    };

    const removeRow = (index: number) => {
        if (loads.length > 1) {
            setLoads(loads.filter((_, i) => i !== index));
        }
    };

    const handleTrailerSelect = (index: number, trailerId: string) => {
        const trailer = trailers.find((t) => t.id.toString() === trailerId);
        const newLoads = [...loads];
        newLoads[index] = {
            ...newLoads[index],
            trailer_id: trailerId,
            fleet_number: trailer?.fleet_number || '',
            registration_number: trailer?.registration_number || '',
        };
        setLoads(newLoads);
    };

    const updateLoad = (
        index: number,
        field: keyof LoadItem,
        value: string,
    ) => {
        const newLoads = [...loads];
        newLoads[index] = { ...newLoads[index], [field]: value };
        setLoads(newLoads);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const missingTrailer = loads.some((load) => !load.trailer_id);
        if (missingTrailer) {
            setErrors({
                'loads.0.trailer_id': 'Please select a trailer for each row',
            });
            setIsSubmitting(false);
            return;
        }

        const formattedLoads = loads.map((load) => ({
            fleet_number: load.fleet_number,
            registration_number: load.registration_number,
            loaded: load.loaded,
            location: load.location || null,
            comment: load.comment || null,
        }));

        router.post(
            store(),
            {
                date,
                loads: formattedLoads,
            },
            {
                onFinish: () => setIsSubmitting(false),
                onError: (err) => setErrors(err),
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/' },
        { title: 'Trailer Loaded Reports', href: index().url },
        { title: 'Add Report', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Trailer Loaded Report" />
            <Wrapper>
                <div className="mb-6 flex items-center justify-between">
                    <Heading
                        title="Add Trailer Loaded Report"
                        description="Create a new trailer loaded report"
                    />
                    <Link href={index()}>
                        <Button variant="secondary" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Reports
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Report Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    className="max-w-xs"
                                />
                                {errors.date && (
                                    <p className="text-sm text-destructive">
                                        {errors.date}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Loads ({loads.length} rows)</CardTitle>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addRow}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Row
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-muted/50 text-sm">
                                            <th className="px-4 py-3 text-left font-medium">
                                                Fleet Number
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Registration Number
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Loaded
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Location
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Comment
                                            </th>
                                            <th className="w-20 px-4 py-3 text-left font-medium">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loads.map((load, index) => {
                                            const availableTrailers =
                                                getAvailableTrailers(index);
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b"
                                                >
                                                    <td className="px-4 py-3">
                                                        <Select
                                                            value={
                                                                load.trailer_id
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) =>
                                                                handleTrailerSelect(
                                                                    index,
                                                                    value,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger className="h-8 w-40">
                                                                <SelectValue placeholder="Select fleet #" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {availableTrailers.map(
                                                                    (
                                                                        trailer,
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                trailer.id
                                                                            }
                                                                            value={trailer.id.toString()}
                                                                        >
                                                                            {
                                                                                trailer.fleet_number
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Input
                                                            value={
                                                                load.registration_number
                                                            }
                                                            onChange={(e) =>
                                                                updateLoad(
                                                                    index,
                                                                    'registration_number',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Reg #"
                                                            className="h-8 w-32"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Input
                                                            value={load.loaded}
                                                            onChange={(e) =>
                                                                updateLoad(
                                                                    index,
                                                                    'loaded',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Loaded"
                                                            className="h-8 w-32"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Input
                                                            value={
                                                                load.location
                                                            }
                                                            onChange={(e) =>
                                                                updateLoad(
                                                                    index,
                                                                    'location',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Location"
                                                            className="h-8 w-40"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Input
                                                            value={load.comment}
                                                            onChange={(e) =>
                                                                updateLoad(
                                                                    index,
                                                                    'comment',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Comment"
                                                            className="h-8"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                removeRow(index)
                                                            }
                                                            disabled={
                                                                loads.length ===
                                                                1
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Link href={index()}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save Report
                        </Button>
                    </div>
                </form>
            </Wrapper>
        </AppLayout>
    );
}
