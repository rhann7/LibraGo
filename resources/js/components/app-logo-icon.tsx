import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/storage/img/tb.ico"
            alt="App Logo"
            className={className}
            {...props}
        />
    );
}