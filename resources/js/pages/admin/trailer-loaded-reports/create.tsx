import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    Loader2,
    Plus,
    Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import * as React from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
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

    const getInitialDate = (): Date => {
        const params = new URLSearchParams(window.location.search);
        const dateStr = params.get('date');
        if (dateStr) {
            const parsed = new Date(dateStr);
            if (!isNaN(parsed.getTime())) {
                return parsed;
            }
        }
        return new Date();
    };

    const [date, setDate] = React.useState<Date>(getInitialDate());

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

        const newErrors: Record<string, string> = {};
        let hasErrors = false;

        for (let i = 0; i < loads.length; i++) {
            if (!loads[i].fleet_number.trim()) {
                newErrors[`loads.${i}.fleet_number`] =
                    'Fleet number is required';
                hasErrors = true;
            }
            if (!loads[i].registration_number.trim()) {
                newErrors[`loads.${i}.registration_number`] =
                    'Registration number is required';
                hasErrors = true;
            }
            if (!loads[i].location.trim()) {
                newErrors[`loads.${i}.location`] = 'Location is required';
                hasErrors = true;
            }
        }

        const seen = new Set<string>();
        for (let i = 0; i < loads.length; i++) {
            const key = `${loads[i].fleet_number}-${loads[i].registration_number}`;
            if (seen.has(key)) {
                newErrors[`loads.${i}.fleet_number`] =
                    'Duplicate trailer entry';
                hasErrors = true;
            }
            seen.add(key);
        }

        if (hasErrors) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        const formattedLoads = loads.map((load) => ({
            fleet_number: load.fleet_number,
            registration_number: load.registration_number,
            loaded: load.loaded,
            location: load.location,
            comment: load.comment || null,
        }));

        router.post(
            store(),
            {
                date: date.toISOString().split('T')[0],
                loads: formattedLoads,
            },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    toast.success('Report created successfully');
                },
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
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="max-w-xs justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date
                                                ? date.toLocaleDateString(
                                                      'en-GB',
                                                      {
                                                          day: '2-digit',
                                                          month: '2-digit',
                                                          year: 'numeric',
                                                      },
                                                  )
                                                : 'Select date'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(selectedDate) => {
                                                if (selectedDate) {
                                                    setDate(selectedDate);
                                                }
                                            }}
                                            defaultMonth={date}
                                        />
                                    </PopoverContent>
                                </Popover>
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
                                                Fleet Number{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Registration Number{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Loaded
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Location{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </th>
                                            <th className="min-w-[300px] px-4 py-3 text-left font-medium">
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
                                                        {availableTrailers.length >
                                                        0 ? (
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
                                                                <SelectContent
                                                                    position="popper"
                                                                    sideOffset={
                                                                        4
                                                                    }
                                                                >
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
                                                        ) : (
                                                            <div>
                                                                <Input
                                                                    value={
                                                                        load.fleet_number
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateLoad(
                                                                            index,
                                                                            'fleet_number',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="Fleet #"
                                                                    className="h-8 w-40"
                                                                />
                                                                {errors[
                                                                    `loads.${index}.fleet_number`
                                                                ] && (
                                                                    <p className="text-sm text-destructive">
                                                                        {
                                                                            errors[
                                                                                `loads.${index}.fleet_number`
                                                                            ]
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {availableTrailers.length >
                                                        0 ? (
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
                                                                    <SelectValue placeholder="Select reg #" />
                                                                </SelectTrigger>
                                                                <SelectContent
                                                                    position="popper"
                                                                    sideOffset={
                                                                        4
                                                                    }
                                                                >
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
                                                                                    trailer.registration_number
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        ) : (
                                                            <div>
                                                                <Input
                                                                    value={
                                                                        load.registration_number
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateLoad(
                                                                            index,
                                                                            'registration_number',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="Reg #"
                                                                    className="h-8 w-40"
                                                                />
                                                                {errors[
                                                                    `loads.${index}.registration_number`
                                                                ] && (
                                                                    <p className="text-sm text-destructive">
                                                                        {
                                                                            errors[
                                                                                `loads.${index}.registration_number`
                                                                            ]
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <Input
                                                                value={
                                                                    load.loaded
                                                                }
                                                                onKeyDown={(
                                                                    e,
                                                                ) => {
                                                                    if (
                                                                        load.loaded ===
                                                                            '' &&
                                                                        e.key
                                                                            .length ===
                                                                            1 &&
                                                                        !e.ctrlKey &&
                                                                        !e.metaKey &&
                                                                        !e.altKey
                                                                    ) {
                                                                        e.preventDefault();
                                                                        updateLoad(
                                                                            index,
                                                                            'loaded',
                                                                            e.key.toUpperCase(),
                                                                        );
                                                                    }
                                                                }}
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    if (
                                                                        load.loaded !==
                                                                        ''
                                                                    ) {
                                                                        updateLoad(
                                                                            index,
                                                                            'loaded',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        );
                                                                    }
                                                                }}
                                                                placeholder="Loaded"
                                                                className="h-8 w-32"
                                                            />
                                                            {errors[
                                                                `loads.${index}.loaded`
                                                            ] && (
                                                                <p className="text-sm text-destructive">
                                                                    {
                                                                        errors[
                                                                            `loads.${index}.loaded`
                                                                        ]
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Select
                                                            value={
                                                                load.location
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) =>
                                                                updateLoad(
                                                                    index,
                                                                    'location',
                                                                    value,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger className="h-8 w-40">
                                                                <SelectValue placeholder="Select location" />
                                                            </SelectTrigger>
                                                            <SelectContent
                                                                position="popper"
                                                                sideOffset={4}
                                                            >
                                                                {[
                                                                    'Bolt',
                                                                    'Freedom Way',
                                                                    'Graph',
                                                                    'Maintenance',
                                                                    'MPT',
                                                                    'Neptune',
                                                                    'Service',
                                                                    'Woodstock',
                                                                    'Yacht Club',
                                                                ].map(
                                                                    (
                                                                        location,
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                location
                                                                            }
                                                                            value={
                                                                                location
                                                                            }
                                                                        >
                                                                            {
                                                                                location
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors[
                                                            `loads.${index}.location`
                                                        ] && (
                                                            <p className="text-sm text-destructive">
                                                                {
                                                                    errors[
                                                                        `loads.${index}.location`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
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
                                                            className="h-8 min-w-[300px]"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-1">
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() =>
                                                                            removeRow(
                                                                                index,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            loads.length ===
                                                                            1
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    Remove row
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
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
