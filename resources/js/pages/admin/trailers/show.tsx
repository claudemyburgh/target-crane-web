import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Hash, Pencil, Trash2, Truck } from 'lucide-react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Wrapper from '@/components/wrapper';
import AppLayout from '@/layouts/app-layout';
import { index as trailersIndex, edit, destroy } from '@/routes/admin/trailers';
import type { BreadcrumbItem } from '@/types';

interface Props {
    trailer: {
        id: number;
        fleet_number: string;
        registration_number: string;
        brand_name: string;
        axles_amount: number;
        license_expiry_date: string;
        created_at: string;
        updated_at: string;
    };
    can: {
        edit: boolean;
        delete: boolean;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Trailers', href: trailersIndex().url },
    { title: 'Trailer Details', href: trailersIndex().url },
];

export default function Show({ trailer, can }: Props) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this trailer?')) {
            router.delete(destroy({ trailer: trailer.id }), {
                onSuccess: () => toast.success('Trailer deleted successfully'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Trailer ${trailer.fleet_number}`} />
            <Wrapper>
                <Heading
                    title={`Trailer ${trailer.fleet_number}`}
                    action={
                        <Link href={trailersIndex()}>
                            <Button size="sm" variant="secondary">
                                Back
                            </Button>
                        </Link>
                    }
                />
                <div className="grid max-w-2xl gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <Truck className="h-5 w-5" />
                            <CardTitle>Fleet Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Hash className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Fleet Number
                                    </p>
                                    <p className="font-medium">
                                        {trailer.fleet_number}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Truck className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Registration Number
                                    </p>
                                    <p className="font-medium">
                                        {trailer.registration_number}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Truck className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Brand
                                    </p>
                                    <p className="font-medium">
                                        {trailer.brand_name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Truck className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Number of Axles
                                    </p>
                                    <p className="font-medium">
                                        {trailer.axles_amount}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <CardTitle>License Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        License Expiry Date
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            trailer.license_expiry_date,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {can.edit || can.delete ? (
                        <div className="flex gap-4 md:col-span-2">
                            {can.edit && (
                                <Button asChild>
                                    <Link href={edit({ trailer: trailer.id })}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit Trailer
                                    </Link>
                                </Button>
                            )}
                            {can.delete && (
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Trailer
                                </Button>
                            )}
                        </div>
                    ) : null}
                </div>
            </Wrapper>
        </AppLayout>
    );
}
