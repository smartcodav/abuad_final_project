import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div
            className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-br from-indigo-50
                via-white to-pink-50 p-6 dark:from-background dark:via-background dark:to-background md:p-10"
        >
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-32 -left-24 size-[28rem] rounded-full bg-primary/35 blur-3xl dark:bg-primary/20" />
                <div className="absolute -right-24 -bottom-32 size-[28rem] rounded-full bg-[hsl(316,74%,57%)]/30 blur-3xl dark:bg-[hsl(316,74%,57%)]/20" />
                <div className="absolute top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(38,92%,56%)]/15 blur-3xl" />
            </div>

            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sidebar-primary shadow-lg shadow-primary/30">
                                <AppLogoIcon className="size-6 fill-current text-white" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-muted-foreground text-center text-sm">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
