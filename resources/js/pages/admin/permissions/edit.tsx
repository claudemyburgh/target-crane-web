import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import * as React from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Wrapper from '@/components/wrapper';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import {
    index,
    edit,
    show,
    destroy,
    update as updateRoute,
} from '@/routes/admin/permissions';
import type { BreadcrumbItem } from '@/types';

export default function PermissionEdit({
    permission,
}: {
    permission: {
        id: number;
        name: string;
    };
}) {
    const [name, setName] = React.useState(permission.name);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.put(
            updateRoute(permission.id),
            { name },
            {
                onSuccess: () => {
                    toast.success('Permission updated successfully');
                    router.get(show(permission.id));
                },
                onError: (errors) => {
                    toast.error(
                        errors.name?.[0] || 'Failed to update permission',
                    );
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: dashboard() },
        { title: 'Permissions', href: index() },
        { title: `Edit: ${permission.name}`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Permission: ${permission.name}`} />
            <Wrapper>
                <div className="mb-4">
                    <Link href={show(permission.id)}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Permission
                        </Button>
                    </Link>
                </div>

                <Heading
                    title={`Edit Permission: ${permission.name}`}
                    description="Update the permission name."
                    variant="default"
                />

                <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Permission Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., edit posts, delete users"
                            required
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => router.get(show(permission.id))}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Wrapper>
        </AppLayout>
    );
}
