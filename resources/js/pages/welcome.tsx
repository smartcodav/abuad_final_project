import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Face Authentication Examination Attendance System" />

            <div className="flex min-h-svh flex-col bg-background">
                <header className="mx-auto flex w-full max-w-4xl items-center justify-between p-6">
                    <div className="flex items-center gap-2">
                        <div className="flex size-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                            <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
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
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Face Authentication Examination Attendance System</h1>
                        <p className="mx-auto max-w-2xl text-balance text-muted-foreground">
                            An AI and facial-recognition driven platform for strict, compliant attendance monitoring during university
                            examinations &mdash; from student onboarding and course registration to live identity verification by
                            invigilators on the exam floor.
                        </p>
                    </div>

                    {!auth.user && (
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <Button size="lg" asChild>
                                <Link href={route('student.login')}>Student Login</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href={route('login')}>Admin / Invigilator Login</Link>
                            </Button>
                        </div>
                    )}
                </main>

                <footer className="mx-auto w-full max-w-3xl px-6 py-8 text-center text-sm text-muted-foreground">
                    <p>
                        A personal project by <span className="font-medium text-foreground">Mr. Frank Enobong Samuel</span>
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
