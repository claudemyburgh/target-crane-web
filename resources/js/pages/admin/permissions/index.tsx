import { Head, router } from '@inertiajs/react';
import * as React from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Wrapper from '@/components/wrapper';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import { index } from '@/routes/admin/permissions';
import type { BreadcrumbItem } from '@/types';

export default function PermissionsIndex({
    permissions,
    filters,
}: {
    permissions: any;
    filters: any;
}) {
    const [search, setSearch] = React.useState(filters?.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            index(),
            { search: search || undefined },
            { preserveState: true, preserveScroll: true },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: dashboard() },
        { title: 'Permissions', href: index() },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <Wrapper>
                <Heading
                    title="Permissions"
                    description="View all system permissions. Permissions are managed by the system."
                    variant="default"
                />

                <div className="mb-4 flex items-center gap-2">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            placeholder="Search permissions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-64"
                        />
                        <Button type="submit" variant="secondary">
                            Search
                        </Button>
                    </form>
                </div>

                <div className="rounded-md border">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Guard
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Created
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No permissions found
                                    </td>
                                </tr>
                            ) : (
                                permissions.data.map((perm: any) => (
                                    <tr
                                        key={perm.id}
                                        className="border-t hover:bg-muted/50"
                                    >
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-sm">
                                                {perm.name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-muted-foreground">
                                                {perm.guard_name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(
                                                    perm.created_at,
                                                ).toLocaleDateString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {permissions.last_page > 1 && (
                    <div className="mt-4 flex justify-center gap-2">
                        {Array.from(
                            { length: permissions.last_page },
                            (_, i) => (
                                <Button
                                    key={i}
                                    variant={
                                        permissions.current_page === i + 1
                                            ? 'default'
                                            : 'secondary'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        router.get(
                                            index({
                                                mergeQuery: { page: i + 1 },
                                            }),
                                            {},
                                            { preserveScroll: true },
                                        )
                                    }
                                >
                                    {i + 1}
                                </Button>
                            ),
                        )}
                    </div>
                )}
            </Wrapper>
        </AppLayout>
    );
}
