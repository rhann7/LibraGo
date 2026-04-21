import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLogoIcon from '@/components/app-logo-icon';

const dummyCovers = [
    'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    'https://covers.openlibrary.org/b/id/8091016-L.jpg',
    'https://covers.openlibrary.org/b/id/6979861-L.jpg',
];

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="relative flex min-h-screen flex-col text-white">
                <img src="/storage/img/tb.jpg" alt="LibraGo" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/70" />
                
                <div className="relative z-10 flex min-h-screen flex-col">
                    <header className="flex w-full items-center justify-between p-6">
                        <Link href="#" className="flex items-center gap-2 font-semibold text-lg">
                            <AppLogoIcon className="size-6 fill-current" />
                            LibraGo
                        </Link>
                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="inline-block rounded-sm border border-black px-5 py-1.5 text-sm hover:border-[#1915014a] dark:border-white dark:hover:border-[#62605b]">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="inline-block rounded-sm border border-black px-5 py-1.5 text-sm hover:border-[#1915014a] dark:border-white dark:hover:border-[#62605b]">
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="flex flex-1 items-center justify-center px-8 p-16">
                        <div className="flex items-center justify-center gap-8 w-full max-w-6xl">
                            <div className="hidden lg:flex items-center gap-4">
                                <div className="h-40 w-28 rotate-[-8deg] overflow-hidden rounded-sm border border-black/10 shadow-md translate-y-6 opacity-60">
                                    <img src={dummyCovers[0]} alt="book" className="h-full w-full object-cover" />
                                </div>
                                <div className="h-56 w-36 rotate-[-4deg] overflow-hidden rounded-sm border border-black/10 shadow-lg translate-y-3 opacity-80">
                                    <img src={dummyCovers[1]} alt="book" className="h-full w-full object-cover" />
                                </div>
                            </div>

                            <div className="flex flex-col items-center text-center space-y-5 max-w-xl">
                                <h1 className="text-6xl font-semibold leading-tight tracking-tight">
                                    Your school library{' '}
                                    <br />
                                    is now{' '}
                                    <em className="italic">online!</em>
                                </h1>
                                <p className="text-base text-[#62605b] dark:text-[#a0a09a]">
                                    A simple digital library built for your school.
                                    <br />
                                    Borrow books easily anytime through a simple digital system.
                                </p>
                                <div className="flex items-center gap-3 pt-2">
                                    {!auth.user && canRegister && (
                                        <Link href={route('register')} className="inline-block rounded-sm bg-[#1b1b18] px-6 py-2 text-sm text-white hover:bg-[#2d2d28] dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-white">
                                            Get Started
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div className="hidden lg:flex items-center gap-4">
                                <div className="h-56 w-36 rotate-[4deg] overflow-hidden rounded-sm border border-black/10 shadow-lg translate-y-3 opacity-80">
                                    <img src={dummyCovers[2]} alt="book" className="h-full w-full object-cover" />
                                </div>
                                <div className="h-40 w-28 rotate-[8deg] overflow-hidden rounded-sm border border-black/10 shadow-md translate-y-6 opacity-60">
                                    <img src={dummyCovers[3]} alt="book" className="h-full w-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer className="py-6 text-center text-xs text-[#62605b] dark:text-[#a0a09a]">
                        © {new Date().getFullYear()} <span className="font-semibold text-foreground">LibraGo</span>. All rights reserved.
                    </footer>
                </div>
            </div>
        </>
    );
}