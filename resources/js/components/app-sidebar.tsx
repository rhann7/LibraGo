import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Library } from 'lucide-react';
import { route } from 'ziggy-js';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage().props;
    const admin = auth.roles.includes('admin');

    const navGroups = admin ? [
        { icon: LayoutGrid, title: 'Dashboard', href: route('dashboard') },
        { icon: Library, title: 'Library', items: [
            { title: 'Book Categories', href: route('books.categories.index') },
            { title: 'Books', href: route('books.index') },
        ] }
    ] : [
        { icon: LayoutGrid, title: 'Dashboard', href: route('dashboard') },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('home')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}