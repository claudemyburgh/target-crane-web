import { Link } from '@inertiajs/react';
import {
    BookOpen,
    ChevronsUpDown,
    FolderGit2,
    Gauge,
    Key,
    LayoutGrid,
    Link2Icon,
    Shield,
    Truck,
    User,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useIsMobile } from '@/hooks/use-mobile';

import { usePermissions } from '@/hooks/use-permissions';
import { dashboard } from '@/routes';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as permissionsIndex } from '@/routes/admin/permissions';
import { index as rolesIndex } from '@/routes/admin/roles';
import { index as trailersIndex } from '@/routes/admin/trailers';
import { index as adminUsersIndex } from '@/routes/admin/users';
import type { NavItem } from '@/types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

const mainNavItemsBase: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'DesignByCode',
        href: 'https://designbycode.co.za',
        icon: Link2Icon,
    },
];

export function AppSidebar() {
    const { isAdmin, isModerator } = usePermissions();
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const { currentUrl, isCurrentUrl } = useCurrentUrl();
    const inAdminSection = currentUrl.startsWith('/admin');
    const canAccessAdmin = isAdmin() || isModerator();

    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: adminDashboard(),
            icon: Gauge,
        },
        {
            title: 'Users',
            href: adminUsersIndex(),
            icon: Users,
        },
        {
            title: 'Trailers',
            href: trailersIndex(),
            icon: Truck,
        },
        {
            title: 'Trailer Reports',
            href: '/admin/trailer-loaded-reports',
            icon: Truck,
        },
    ];

    const rolesPermissionsItems: NavItem[] = [
        {
            title: 'Roles',
            href: rolesIndex(),
            icon: Shield,
        },
        {
            title: 'Permissions',
            href: permissionsIndex(),
            icon: Key,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            {canAccessAdmin ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton
                                            size="lg"
                                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                        >
                                            <AppLogo />
                                            <ChevronsUpDown className="ml-auto size-4" />
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                        align="start"
                                        side={
                                            isMobile
                                                ? 'bottom'
                                                : state === 'collapsed'
                                                  ? 'right'
                                                  : 'bottom'
                                        }
                                        sideOffset={4}
                                    >
                                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                                            Switch Navigation
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                prefetch
                                                href={dashboard()}
                                                className="gap-2"
                                            >
                                                <User className="size-4" />
                                                <span>User Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                prefetch
                                                href={adminDashboard()}
                                                className="gap-2"
                                            >
                                                <Shield className="size-4" />
                                                <span>
                                                    Administrator Dashboard
                                                </span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <SidebarMenuButton size="lg" asChild>
                                    <Link href={dashboard()} prefetch>
                                        <AppLogo />
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
            </SidebarHeader>

            <SidebarContent>
                {inAdminSection && canAccessAdmin ? (
                    <>
                        <SidebarGroup>
                            <SidebarGroupLabel>Admin</SidebarGroupLabel>
                            <SidebarMenu>
                                {adminNavItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isCurrentUrl(
                                                item.href as string,
                                            )}
                                            tooltip={{ children: item.title }}
                                        >
                                            <Link href={item.href} prefetch>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                        {isAdmin() && (
                            <SidebarGroup>
                                <SidebarGroupLabel>
                                    Roles & Permissions
                                </SidebarGroupLabel>
                                <SidebarMenu>
                                    {rolesPermissionsItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isCurrentUrl(
                                                    item.href as string,
                                                )}
                                                tooltip={{
                                                    children: item.title,
                                                }}
                                            >
                                                <Link href={item.href} prefetch>
                                                    {item.icon && <item.icon />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroup>
                        )}
                    </>
                ) : (
                    <NavMain items={mainNavItemsBase} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
