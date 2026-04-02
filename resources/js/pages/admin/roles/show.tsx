import { Head, Link, router } from '@inertiajs/react';
import { Shield, ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import * as React from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Wrapper from '@/components/wrapper';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import { index, edit, destroy } from '@/routes/admin/roles';
import type { BreadcrumbItem } from '@/types';

type Permission = {
    id: number;
    name: string;
};

export default function RoleShow({
    role,
    can,
}: {
    role: {
        id: number;
        name: string;
        guard_name: string;
        permissions: Permission[];
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
        router.delete(destroy(role.id), {
            onSuccess: () => {
                setConfirmDelete(false);
                toast.success('Role deleted successfully');
                router.get(index());
            },
            onFinish: () => setIsDeleting(false),
            preserveScroll: true,
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: dashboard() },
        { title: 'Roles', href: index() },
        { title: role.name, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Role: ${role.name}`} />
            <Wrapper>
                <div className="mb-4">
                    <Link href={index()}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Roles
                        </Button>
                    </Link>
                </div>

                <Heading
                    title={role.name}
                    description={`Role details and permissions`}
                    variant="default"
                    action={
                        <div className="flex gap-2">
                            {can?.edit && (
                                <Link href={edit(role.id)}>
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
                        <h3 className="mb-4 font-semibold">Role Information</h3>
                        <dl className="space-y-3">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Name</dt>
                                <dd className="flex items-center gap-2 font-medium">
                                    <Shield className="h-4 w-4" />
                                    <span className="capitalize">
                                        {role.name}
                                    </span>
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Guard</dt>
                                <dd>
                                    <Badge variant="secondary">
                                        {role.guard_name}
                                    </Badge>
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Created
                                </dt>
                                <dd className="text-sm">
                                    {new Date(role.created_at).toLocaleString()}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Updated
                                </dt>
                                <dd className="text-sm">
                                    {new Date(role.updated_at).toLocaleString()}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-lg border p-6">
                        <h3 className="mb-4 font-semibold">
                            Permissions ({role.permissions.length})
                        </h3>
                        {role.permissions.length === 0 ? (
                            <p className="text-muted-foreground text-sm">
                                No permissions assigned
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {role.permissions.map((perm) => (
                                    <Badge key={perm.id} variant="outline">
                                        {perm.name}
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
                            Delete Role
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Are you sure you want to delete the role "
                            {role.name}"? This action cannot be undone.
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
