import { Head, Link, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Wrapper from '@/components/wrapper';
import AppLayout from '@/layouts/app-layout';
import { index as trailersIndex, store } from '@/routes/admin/trailers';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Trailers', href: trailersIndex().url },
    { title: 'Create Trailer', href: trailersIndex().url },
];

export default function Create() {
    const form = useForm({
        fleet_number: '',
        registration_number: '',
        brand_name: '',
        axles_amount: 2,
        license_expiry_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.submit(store(), {
            preserveScroll: true,
            onSuccess: () => toast.success('Trailer created successfully'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Trailer" />
            <Wrapper>
                <Heading
                    title="Create Trailer"
                    description="Add a new trailer to your fleet"
                    action={
                        <Link href={trailersIndex()}>
                            <Button size="sm" variant="secondary">
                                Back
                            </Button>
                        </Link>
                    }
                />
                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="fleet_number">Fleet Number</Label>
                        <Input
                            id="fleet_number"
                            type="text"
                            value={form.data.fleet_number}
                            onChange={(e) =>
                                form.setData('fleet_number', e.target.value)
                            }
                            placeholder="e.g., T01"
                        />
                        {form.errors.fleet_number && (
                            <p className="text-sm text-destructive">
                                {form.errors.fleet_number}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="registration_number">
                            Registration Number
                        </Label>
                        <Input
                            id="registration_number"
                            type="text"
                            value={form.data.registration_number}
                            onChange={(e) =>
                                form.setData(
                                    'registration_number',
                                    e.target.value,
                                )
                            }
                            placeholder="e.g., CA10001"
                        />
                        {form.errors.registration_number && (
                            <p className="text-sm text-destructive">
                                {form.errors.registration_number}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="brand_name">Brand Name</Label>
                        <Input
                            id="brand_name"
                            type="text"
                            value={form.data.brand_name}
                            onChange={(e) =>
                                form.setData('brand_name', e.target.value)
                            }
                            placeholder="e.g., Volvo"
                        />
                        {form.errors.brand_name && (
                            <p className="text-sm text-destructive">
                                {form.errors.brand_name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="axles_amount">Number of Axles</Label>
                        <Input
                            id="axles_amount"
                            type="number"
                            min={1}
                            max={10}
                            value={form.data.axles_amount}
                            onChange={(e) =>
                                form.setData(
                                    'axles_amount',
                                    parseInt(e.target.value),
                                )
                            }
                        />
                        {form.errors.axles_amount && (
                            <p className="text-sm text-destructive">
                                {form.errors.axles_amount}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="license_expiry_date">
                            License Expiry Date
                        </Label>
                        <Input
                            id="license_expiry_date"
                            type="date"
                            value={form.data.license_expiry_date}
                            onChange={(e) =>
                                form.setData(
                                    'license_expiry_date',
                                    e.target.value,
                                )
                            }
                        />
                        {form.errors.license_expiry_date && (
                            <p className="text-sm text-destructive">
                                {form.errors.license_expiry_date}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={form.processing}>
                            Create Trailer
                        </Button>
                    </div>
                </form>
            </Wrapper>
        </AppLayout>
    );
}
