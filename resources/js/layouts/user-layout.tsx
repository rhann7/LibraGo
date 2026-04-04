import { Link, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { type PropsWithChildren } from 'react';
import { route } from 'ziggy-js';
import AppLogoIcon from '@/components/app-logo-icon';
import FlashMessage from '@/components/flash-message';
import { NavUserMenuContent } from '@/components/nav-user-menu-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import type { Auth } from '@/types';

const navItems = [
    { title: 'Home', href: route('home') },
    { title: 'Books', href: route('books.index') },
    { title: 'Categories', href: route('books.categories.index') },
    { title: 'Authors', href: '#' },
    { title: 'Publishers', href: '#' },
];

interface UserLayoutProps extends PropsWithChildren {
    title?: string;
    breadcrumbs?: { title: string; href?: string }[];
}

export default function UserLayout({ children, title, breadcrumbs }: UserLayoutProps) {
    const { auth } = usePage().props;
    const { user } = auth as Auth;
    const { isCurrentUrl } = useCurrentUrl();
    const getInitials = useInitials();

    return (
        <>
            {title && <Head title={title} />}

            <div className="flex min-h-screen flex-col bg-background">
                <header className="sticky top-0 z-40 border-b border-border bg-background">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
                        <Link href={route('dashboard')} className="flex items-center gap-2 font-semibold">
                            <AppLogoIcon className="size-6 fill-current" />
                            <span>LibraGo</span>
                        </Link>

                        <nav className="hidden items-center gap-6 text-sm md:flex">
                            {navItems.map(item => (
                                <Link key={item.title} href={item.href} className={cn("transition-colors hover:text-foreground text-sm", isCurrentUrl(item.href) ? "text-foreground font-medium" : "text-muted-foreground")}>
                                    {item.title}
                                </Link>
                            ))}
                        </nav>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="outline-none">
                                    <Avatar className="size-8 overflow-hidden rounded-full cursor-pointer">
                                        <AvatarImage src={user.avatar_url} alt={user.name} />
                                        <AvatarFallback className="rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <NavUserMenuContent user={user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1">
                    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
                        {breadcrumbs && breadcrumbs.length > 0 && (
                            <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                                {breadcrumbs.map((crumb, i) => (
                                    <span key={i} className="flex items-center gap-2">
                                        {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                                        {crumb.href ? (
                                            <Link href={crumb.href} className="hover:text-foreground transition-colors">
                                                {crumb.title}
                                            </Link>
                                        ) : (
                                            <span className="text-foreground">{crumb.title}</span>
                                        )}
                                    </span>
                                ))}
                            </nav>
                        )}
                        {children}
                    </div>
                </main>

                <footer className="border-t border-border py-6">
                    <div className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground md:px-8">
                        © {new Date().getFullYear()} <span className="font-semibold text-foreground">LibraGo</span>. All rights reserved.
                    </div>
                </footer>
            </div>

            <FlashMessage />
        </>
    );
}