import { Link, usePage } from '@inertiajs/react';
import { ChartBar, LayoutGrid, Library, UsersRound } from 'lucide-react';
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
        { icon: UsersRound, title: 'Users', items: [
            { title: 'Users', href: route('users.index') },
            { title: 'Students', href: route('students.index') },
            { title: 'Teachers', href: route('teachers.index') },
        ] },
        { icon: Library, title: 'Libraries', items: [
            { title: 'Book Categories', href: route('books.categories.index') },
            { title: 'Books', href: route('books.index') },
            { title: 'Book Units', href: route('book-units.index') },
        ] },
        { icon: ChartBar, title: 'Transactions', items: [
            { title: 'Loan Requests', href: route('loan-requests.index') },
            { title: 'Loans', href: route('loans.index') },
            { title: 'Fines', href: route('fines.index') },
        ] },
    ] : [
        { icon: LayoutGrid, title: 'Dashboard', href: route('dashboard') },
        { icon: ChartBar, title: 'Transactions', items: [
            { title: 'Loan Requests', href: route('loan-requests.index') },
            { title: 'Loans', href: route('loans.index') },
            { title: 'Fines', href: route('fines.index') },
        ] },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            {admin ? (
                                <div className="flex items-center gap-2 px-2">
                                    <AppLogo />
                                </div>
                            ) : (
                                <Link href={route('home')} prefetch>
                                    <AppLogo />
                                </Link>
                            )}
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