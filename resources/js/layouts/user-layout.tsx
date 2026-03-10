import { Link, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { route } from 'ziggy-js';
import AppLogoIcon from '@/components/app-logo-icon';
import FlashMessage from '@/components/flash-message';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import type { Auth } from '@/types';

const navItems = [
    { title: 'Home', href: '#' },
    { title: 'Books', href: '#' },
    { title: 'Categories', href: route('books.categories.index') },
    { title: 'Authors', href: '#' },
    { title: 'Publishers', href: '#' },
];

interface UserLayoutProps extends PropsWithChildren {
    title?: string;
}

export default function UserLayout({ children, title }: UserLayoutProps) {
    const { auth } = usePage().props;
    const { user } = auth as Auth;
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
                                <Link key={item.title} href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
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
                                <UserMenuContent user={user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1">
                    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
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