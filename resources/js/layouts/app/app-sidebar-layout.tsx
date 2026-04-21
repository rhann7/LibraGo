import { usePage, Link } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { route } from 'ziggy-js';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: AppLayoutProps) {
    const { auth } = usePage().props;

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {auth.has_overdue_loan && !auth.roles?.includes('admin') && (
                    <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                            <p className="text-sm text-destructive font-medium">
                                You have an overdue loan. Please return the book immediately to avoid further fines. Visit{' '}
                                <Link href={route('loans.index')} className="underline underline-offset-4">
                                    My Loans
                                </Link>{' '}
                                for details.
                            </p>
                        </div>
                    </div>
                )}
                
                {auth.has_unpaid_fine && (
                    <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-4 w-4 text-yellow-500 shrink-0" />
                            <p className="text-sm text-yellow-500 font-medium">
                                You have an unpaid fine. Please settle your payment as soon as possible. Visit{' '}
                                <Link href={route('fines.index')} className="underline underline-offset-4">
                                    My Fines
                                </Link>{' '}
                                for details.
                            </p>
                        </div>
                    </div>
                )}

                {children}
            </AppContent>
        </AppShell>
    );
}