import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import * as React from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Wrapper from '@/components/wrapper';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import { index, edit, destroy } from '@/routes/admin/permissions';
import type { BreadcrumbItem } from '@/types';

export default function PermissionShow({
    permission,
    can,
}: {
    permission: {
        id: number;
        name: string;
        guard_name: string;
        roles: { id: number; name: string }[];
        created_at: string;
        updated_at: string;
    };
    can: {
        edit: boolean;
        delete: boolean;
    };
}) {
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(destroy(permission.id), {
            onSuccess: () => {
                setConfirmDelete(false);
                toast.success('Permission deleted successfully');
                router.get(index());
            },
            onFinish: () => setIsDeleting(false),
            preserveScroll: true,
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: dashboard() },
        { title: 'Permissions', href: index() },
        { title: permission.name, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Permission: ${permission.name}`} />
            <Wrapper>
                <div className="mb-4">
                    <Link href={index()}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Permissions
                        </Button>
                    </Link>
                </div>

                <Heading
                    title={permission.name}
                    description="Permission details and associated roles"
                    variant="default"
                    action={
                        <div className="flex gap-2">
                            {can?.edit && (
                                <Link href={edit(permission.id)}>
                                    <Button size="sm">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                </Link>
                            )}
                            {can?.delete && (
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => setConfirmDelete(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            )}
                        </div>
                    }
                />

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border p-6">
                        <h3 className="mb-4 font-semibold">
                            Permission Information
                        </h3>
                        <dl className="space-y-3">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Name</dt>
                                <dd className="font-mono font-medium">
                                    {permission.name}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Guard</dt>
                                <dd>
                                    <Badge variant="secondary">
                                        {permission.guard_name}
                                    </Badge>
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Created
                                </dt>
                                <dd className="text-sm">
                                    {new Date(
                                        permission.created_at,
                                    ).toLocaleString()}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Updated
                                </dt>
                                <dd className="text-sm">
                                    {new Date(
                                        permission.updated_at,
                                    ).toLocaleString()}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-lg border p-6">
                        <h3 className="mb-4 font-semibold">
                            Roles with this Permission (
                            {permission.roles.length})
                        </h3>
                        {permission.roles.length === 0 ? (
                            <p className="text-muted-foreground text-sm">
                                No roles have this permission
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {permission.roles.map((role) => (
                                    <Badge key={role.id} variant="outline">
                                        {role.name}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Wrapper>

            {confirmDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setConfirmDelete(false)}
                >
                    <div
                        className="bg-background w-full max-w-md rounded-lg p-6 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="mb-2 text-lg font-semibold">
                            Delete Permission
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Are you sure you want to delete the permission "
                            {permission.name}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => setConfirmDelete(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
