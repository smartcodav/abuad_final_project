import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Building2, CalendarRange, Folder, GraduationCap, LayoutGrid, ShieldCheck, UsersRound } from 'lucide-react';
import AppLogo from './app-logo';

const defaultNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Schools',
        url: '/admin/schools',
        icon: Building2,
    },
    {
        title: 'Departments',
        url: '/admin/departments',
        icon: GraduationCap,
    },
    {
        title: 'Academic Sessions',
        url: '/admin/academic-sessions',
        icon: CalendarRange,
    },
    {
        title: 'Semesters',
        url: '/admin/semesters',
        icon: CalendarRange,
    },
    {
        title: 'Students',
        url: '/admin/students',
        icon: UsersRound,
    },
    {
        title: 'Invigilators',
        url: '/admin/invigilators',
        icon: ShieldCheck,
    },
    {
        title: 'Courses',
        url: '/admin/courses',
        icon: BookOpen,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const mainNavItems = auth.user.role === 'admin' ? adminNavItems : defaultNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
