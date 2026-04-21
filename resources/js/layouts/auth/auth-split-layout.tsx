import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLogoIcon from '@/components/app-logo-icon';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({ children, title, description }: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-[70%_30%] lg:px-0">
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
                <img src="/storage/img/tb2.jpg" alt="LibraGo" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/50" />
                <Link href={route('welcome')} className="relative z-20 flex items-center gap-2 font-semibold text-lg">
                    <AppLogoIcon className="size-6 fill-current text-white" />
                    {name}
                </Link>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-87.5">
                    <Link href={route('welcome')} className="relative z-20 flex items-center justify-center gap-2 font-semibold text-lg lg:hidden">
                        <AppLogoIcon className="size-6 fill-current" />
                        {name}
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}