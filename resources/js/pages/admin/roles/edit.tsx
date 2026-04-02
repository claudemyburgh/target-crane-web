import { Head, router } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Wrapper from '@/components/wrapper';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import { index, show, update } from '@/routes/admin/roles';
import type { BreadcrumbItem } from '@/types';

type Permission = {
    id: number;
    name: string;
    guard_name: string;
};

type GroupedPermissions = {
    [key: string]: Permission[];
};

export default function RoleEdit({
    role,
    permissions,
}: {
    role: {
        id: number;
        name: string;
        permissions: number[];
    };
    permissions: Permission[];
}) {
    const [name, setName] = React.useState(role.name);
    const [selectedPermissions, setSelectedPermissions] = React.useState<
        number[]
    >(role.permissions);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [openGroups, setOpenGroups] = React.useState<string[]>([]);
    const [activeTab, setActiveTab] = React.useState<'web' | 'api'>('web');

    const webPermissions = React.useMemo(
        () => permissions.filter((p) => p.guard_name === 'web'),
        [permissions],
    );

    const apiPermissions = React.useMemo(
        () => permissions.filter((p) => p.guard_name === 'api'),
        [permissions],
    );

    const currentPermissions =
        activeTab === 'web' ? webPermissions : apiPermissions;

    const groupedPermissions = React.useMemo(() => {
        const groups: GroupedPermissions = {};

        currentPermissions.forEach((perm) => {
            const parts = perm.name.split(' ');
            const groupKey = parts[0];

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(perm);
        });

        return Object.entries(groups)
            .sort(([a], [b]) => a.localeCompare(b))
            .reduce((acc, [key, value]) => {
                acc[key] = value.sort((a, b) => a.name.localeCompare(b.name));
                return acc;
            }, {} as GroupedPermissions);
    }, [currentPermissions]);

    const toggleGroup = (group: string) => {
        setOpenGroups((prev) =>
            prev.includes(group)
                ? prev.filter((g) => g !== group)
                : [...prev, group],
        );
    };

    const togglePermission = (id: number) => {
        setSelectedPermissions((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
        );
    };

    const selectAllInGroup = (groupPermissions: Permission[]) => {
        const ids = groupPermissions.map((p) => p.id);
        const allSelected = ids.every((id) => selectedPermissions.includes(id));

        if (allSelected) {
            setSelectedPermissions((prev) =>
                prev.filter((id) => !ids.includes(id)),
            );
        } else {
            setSelectedPermissions((prev) => [
                ...prev,
                ...ids.filter((id) => !prev.includes(id)),
            ]);
        }
    };

    const selectAllInTab = () => {
        const ids = currentPermissions.map((p) => p.id);
        const allSelected = ids.every((id) => selectedPermissions.includes(id));

        if (allSelected) {
            setSelectedPermissions((prev) =>
                prev.filter((id) => !ids.includes(id)),
            );
        } else {
            setSelectedPermissions((prev) => [
                ...prev,
                ...ids.filter((id) => !prev.includes(id)),
            ]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.put(
            update(role.id),
            {
                name,
                permissions: selectedPermissions,
            },
            {
                onSuccess: () => {
                    toast.success('Role updated successfully');
                    router.get(show(role.id));
                },
                onError: (errors) => {
                    toast.error(errors.name?.[0] || 'Failed to update role');
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    const formatGroupName = (group: string): string => {
        return group
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const getSelectedCountForTab = (tab: 'web' | 'api') => {
        const tabPerms = tab === 'web' ? webPermissions : apiPermissions;
        return tabPerms.filter((p) => selectedPermissions.includes(p.id))
            .length;
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: dashboard() },
        { title: 'Roles', href: index() },
        { title: `Edit: ${role.name}`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Role: ${role.name}`} />
            <Wrapper>
                <Heading
                    title={`Edit Role: ${role.name}`}
                    description="Update the role name and permissions."
                    variant="default"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-lg border p-6">
                        <h3 className="mb-4 text-lg font-semibold">
                            Role Information
                        </h3>
                        <div className="space-y-2">
                            <Label htmlFor="name">Role Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., editor, manager"
                                className="max-w-md"
                                required
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                                Permissions
                            </h3>
                            <div className="text-muted-foreground text-sm">
                                {selectedPermissions.length} of{' '}
                                {permissions.length} selected
                            </div>
                        </div>

                        <div className="mb-4 flex items-center gap-4 border-b">
                            <button
                                type="button"
                                onClick={() => setActiveTab('web')}
                                className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                                    activeTab === 'web'
                                        ? 'border-primary text-primary'
                                        : 'text-muted-foreground hover:text-foreground border-transparent'
                                }`}
                            >
                                Web
                                <span className="bg-muted rounded-full px-2 py-0.5 text-xs">
                                    {getSelectedCountForTab('web')}/
                                    {webPermissions.length}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('api')}
                                className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                                    activeTab === 'api'
                                        ? 'border-primary text-primary'
                                        : 'text-muted-foreground hover:text-foreground border-transparent'
                                }`}
                            >
                                API
                                <span className="bg-muted rounded-full px-2 py-0.5 text-xs">
                                    {getSelectedCountForTab('api')}/
                                    {apiPermissions.length}
                                </span>
                            </button>
                            <div className="grow" />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={selectAllInTab}
                            >
                                {currentPermissions.every((p) =>
                                    selectedPermissions.includes(p.id),
                                )
                                    ? 'Deselect All'
                                    : 'Select All'}
                            </Button>
                        </div>

                        {Object.keys(groupedPermissions).length === 0 ? (
                            <p className="text-muted-foreground text-sm">
                                No permissions available
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {Object.entries(groupedPermissions).map(
                                    ([group, perms]) => {
                                        const groupIds = perms.map((p) => p.id);
                                        const allSelected = groupIds.every(
                                            (id) =>
                                                selectedPermissions.includes(
                                                    id,
                                                ),
                                        );

                                        return (
                                            <Collapsible
                                                key={group}
                                                open={openGroups.includes(
                                                    group,
                                                )}
                                                onOpenChange={() =>
                                                    toggleGroup(group)
                                                }
                                            >
                                                <CollapsibleTrigger asChild>
                                                    <div className="bg-muted/50 hover:bg-muted flex cursor-pointer items-center justify-between rounded-md border p-3">
                                                        <div className="flex items-center gap-3">
                                                            {openGroups.includes(
                                                                group,
                                                            ) ? (
                                                                <ChevronDown className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronRight className="h-4 w-4" />
                                                            )}
                                                            <span className="font-medium capitalize">
                                                                {formatGroupName(
                                                                    group,
                                                                )}
                                                            </span>
                                                            <span className="text-muted-foreground text-sm">
                                                                ({perms.length})
                                                            </span>
                                                        </div>
                                                        <Checkbox
                                                            checked={
                                                                allSelected
                                                            }
                                                            onCheckedChange={() =>
                                                                selectAllInGroup(
                                                                    perms,
                                                                )
                                                            }
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        />
                                                    </div>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <div className="grid grid-cols-1 gap-2 border p-3 md:grid-cols-2 lg:grid-cols-3">
                                                        {perms.map((perm) => (
                                                            <label
                                                                key={perm.id}
                                                                className="hover:bg-muted/50 flex cursor-pointer items-center gap-2 rounded p-2"
                                                            >
                                                                <Checkbox
                                                                    checked={selectedPermissions.includes(
                                                                        perm.id,
                                                                    )}
                                                                    onCheckedChange={() =>
                                                                        togglePermission(
                                                                            perm.id,
                                                                        )
                                                                    }
                                                                />
                                                                <span className="font-mono text-sm">
                                                                    {perm.name}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        );
                                    },
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => router.get(show(role.id))}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Wrapper>
        </AppLayout>
    );
}
