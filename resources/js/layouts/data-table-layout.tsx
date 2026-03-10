import { Link, Head } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { type ReactNode } from 'react';
import FlashMessage from '@/components/flash-message';
import PageHeader from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface PaginationProps {
    data: any[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number | null;
    to: number | null;
    total: number;
}

interface DataTableLayoutProps {
    title: string;
    description?: string;
    breadcrumbs: BreadcrumbItem[];
    actions?: ReactNode;
    filterWidget?: ReactNode;
    pagination?: PaginationProps;
    children: ReactNode;
    isEmpty?: boolean;
    emptyStateTitle?: string;
    emptyStateDescription?: string;
}

export default function DataTableLayout({
    title,
    description,
    breadcrumbs,
    actions,
    filterWidget,
    pagination,
    children,
    isEmpty = false,
    emptyStateTitle = 'No data found',
    emptyStateDescription = 'Try adjusting your search query.',
}: DataTableLayoutProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <PageHeader title={title} description={description} actions={actions} />

                {filterWidget && (
                    <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 md:flex-row md:items-center">
                        {filterWidget}
                    </div>
                )}

                <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background">
                    <div className="flex-1 overflow-auto">
                        {isEmpty ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                                <div className="rounded-full bg-muted p-3">
                                    <Inbox className="h-6 w-6 text-muted-foreground/60" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">{emptyStateTitle}</p>
                                    <p className="text-xs text-muted-foreground">{emptyStateDescription}</p>
                                </div>
                            </div>
                        ) : (
                            children
                        )}
                    </div>

                    {pagination && pagination.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-border bg-zinc-50/30 px-6 py-4 dark:bg-zinc-900/30">
                            {pagination.from && pagination.to && (
                                <div className="hidden text-xs text-muted-foreground md:block">
                                    Showing <span className="font-medium text-foreground">{pagination.from}</span> to{' '}
                                    <span className="font-medium text-foreground">{pagination.to}</span> of{' '}
                                    <span className="font-medium text-foreground">{pagination.total}</span> results
                                </div>
                            )}

                            <div className="flex w-full items-center justify-center gap-1 md:w-auto">
                                {pagination.links.map((link, i) => {
                                    const isNext = link.label.includes('Next');
                                    const isPrev = link.label.includes('Previous');

                                    return link.url ? (
                                        <Link key={i} href={link.url} preserveScroll
                                            className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-foreground text-background'
                                                    : 'border border-border/60 bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}>
                                            {isPrev ? <ChevronLeft className="h-4 w-4" /> : isNext ? <ChevronRight className="h-4 w-4" /> : link.label}
                                        </Link>
                                    ) : (
                                        <span key={i} className="flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs text-muted-foreground/40 opacity-50">
                                            {isPrev ? <ChevronLeft className="h-4 w-4" /> : isNext ? <ChevronRight className="h-4 w-4" /> : link.label}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <FlashMessage />
        </AppLayout>
    );
}