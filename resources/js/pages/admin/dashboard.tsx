import { Head } from '@inertiajs/react';
import { Users, Activity, Shield, KeyRound } from 'lucide-react';
import StatSimple from '@/components/stats/stat-simple';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import Wrapper from '@/components/wrapper';
import AppLayout from '@/layouts/app-layout';
// TODO: Remove deprecated StatsCard import usages elsewhere if any.
import { dashboard } from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: dashboard(),
    },
];

type UsersSeries = { series: number[]; trend_percent: number } | undefined;

export default function AdminDashboard({
    stats = {
        users: 0,
        users_series: undefined,
        active_users: undefined,
        roles: 0,
        roles_series: undefined,
        permissions: 0,
        permissions_series: undefined,
    },
}: {
    stats?: {
        users: number;
        users_series?: UsersSeries;
        active_users?: { value: number; series: number[]; trend_percent: number } | undefined;
        roles: number;
        roles_series?: UsersSeries;
        permissions: number;
        permissions_series?: UsersSeries;
    };
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Wrapper>
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <StatSimple
                        title="Users"
                        value={stats.users}
                        icon={Users}
                        trend={stats.users_series ? {
                            value: stats.users_series.trend_percent,
                            label: "vs last 14 days"
                        } : undefined}
                    />

                    <StatSimple
                        title="Active Users"
                        value={stats.active_users?.value ?? 0}
                        icon={Activity}
                        trend={stats.active_users ? {
                            value: stats.active_users.trend_percent,
                            label: "vs last 14 days"
                        } : undefined}
                    />

                    <StatSimple
                        title="Roles"
                        value={stats.roles}
                        icon={Shield}
                        trend={stats.roles_series ? {
                            value: stats.roles_series.trend_percent,
                            label: "vs last 14 days"
                        } : undefined}
                    />

                    <StatSimple
                        title="Permissions"
                        value={stats.permissions}
                        icon={KeyRound}
                        trend={stats.permissions_series ? {
                            value: stats.permissions_series.trend_percent,
                            label: "vs last 14 days"
                        } : undefined}
                    />
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </Wrapper>
        </AppLayout>
    );
}
