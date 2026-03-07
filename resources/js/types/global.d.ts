import type { Auth } from '@/types/auth';

interface Flash {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            flash: Flash;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}