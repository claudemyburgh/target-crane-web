import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import * as React from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Wrapper from '@/components/wrapper';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import { index, store } from '@/routes/admin/permissions';
import type { BreadcrumbItem } from '@/types';

export default function PermissionCreate() {
    const [name, setName] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(
            store(),
            { name },
            {
                onSuccess: () => {
                    toast.success('Permission created successfully');
                },
                onError: (errors) => {
                    toast.error(
                        errors.name?.[0] || 'Failed to create permission',
                    );
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: dashboard() },
        { title: 'Permissions', href: index() },
        { title: 'Create Permission', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Permission" />
            <Wrapper>
                <Heading
                    title="Create Permission"
                    description="Create a new permission."
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
                        <p className="text-muted-foreground text-sm">
                            Use lowercase with spaces (e.g., "view posts")
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Permission'}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => router.get(index())}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Wrapper>
        </AppLayout>
    );
}
