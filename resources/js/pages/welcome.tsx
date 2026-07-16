import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Face Authentication Examination Attendance System" />

            <div
                className="relative flex min-h-svh flex-col overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50
                    dark:from-background dark:via-background dark:to-background"
            >
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-40 -left-32 size-[34rem] rounded-full bg-primary/40 blur-3xl dark:bg-primary/25" />
                    <div className="absolute top-1/4 -right-32 size-[30rem] rounded-full bg-[hsl(316,74%,57%)]/35 blur-3xl dark:bg-[hsl(316,74%,57%)]/25" />
                    <div className="absolute bottom-0 left-1/3 size-[26rem] rounded-full bg-[hsl(38,92%,56%)]/30 blur-3xl dark:bg-[hsl(38,92%,56%)]/20" />
                    <div className="absolute top-2/3 left-10 size-72 rounded-full bg-[hsl(199,89%,52%)]/25 blur-3xl dark:bg-[hsl(199,89%,52%)]/20" />
                </div>

                <header className="mx-auto flex w-full max-w-4xl items-center justify-between p-6">
                    <div className="flex items-center gap-2">
                        <div className="flex size-9 items-center justify-center rounded-md bg-gradient-to-br from-primary to-sidebar-primary shadow-lg shadow-primary/30">
                            <AppLogoIcon className="size-5 fill-current text-white" />
                        </div>
                        <span className="font-semibold">FAEAS</span>
                    </div>

                    {auth.user ? (
                        <Button asChild>
                            <Link href={route('dashboard')}>Dashboard</Link>
                        </Button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button variant="outline" asChild>
                                <Link href={route('student.login')}>Student Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href={route('login')}>Staff Login</Link>
                            </Button>
                        </div>
                    )}
                </header>

                <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
                    <div
                        className="inline-flex items-center gap-2 self-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs
                            font-medium text-primary"
                    >
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-primary" />
                        </span>
                        AI-Powered Facial Recognition
                    </div>

                    <div className="space-y-4">
                        <h1
                            className="bg-gradient-to-r from-primary via-[hsl(316,74%,57%)] to-[hsl(38,92%,56%)] bg-clip-text text-3xl font-bold
                                tracking-tight text-transparent sm:text-5xl"
                        >
                            Face Authentication Examination Attendance System
                        </h1>
                        <p className="mx-auto max-w-2xl text-balance text-muted-foreground">
                            An AI and facial-recognition driven platform for strict, compliant attendance monitoring during university
                            examinations &mdash; from student onboarding and course registration to live identity verification by
                            invigilators on the exam floor.
                        </p>
                    </div>

                    {!auth.user && (
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <Button size="lg" className="shadow-lg shadow-primary/30" asChild>
                                <Link href={route('student.login')}>Student Login</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/5" asChild>
                                <Link href={route('login')}>Admin / Invigilator Login</Link>
                            </Button>
                        </div>
                    )}
                </main>

                <footer className="mx-auto w-full max-w-3xl px-6 py-8 text-center text-sm text-muted-foreground">
                    <p>
                        A personal project by <span className="font-medium text-foreground">Frank Enobong Samuel</span>
                        <br />
                        Matric Number: 23/PTS/SCI/01/041 &middot; Department of Computer Science
                        <br />
                        Afe Babalola University (ABUAD)
                    </p>
                </footer>
            </div>
        </>
    );
}
