import { DataTable } from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Academic Sessions', href: '/admin/academic-sessions' }];

interface Semester {
    id: number;
    name: string;
    is_active: boolean;
}

interface AcademicSession {
    id: number;
    name: string;
    is_active: boolean;
    semesters: Semester[];
}

export default function AcademicSessionsIndex({ academicSessions }: { academicSessions: AcademicSession[] }) {
    const destroy = (session: AcademicSession) => {
        if (confirm(`Delete "${session.name}"? This cannot be undone.`)) {
            router.delete(route('admin.academic-sessions.destroy', session.id));
        }
    };

    const activate = (session: AcademicSession) => {
        router.post(route('admin.academic-sessions.activate', session.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Academic Sessions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Academic Sessions</h1>
                    <Link href={route('admin.academic-sessions.create')} className={cn(buttonVariants())}>
                        New Session
                    </Link>
                </div>

                <DataTable
                    data={academicSessions}
                    rowKey={(session) => session.id}
                    columns={[
                        { header: 'Name', cell: (session) => session.name },
                        {
                            header: 'Status',
                            cell: (session) => (session.is_active ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>),
                        },
                        { header: 'Semesters', cell: (session) => session.semesters.map((semester) => semester.name).join(', ') || '—' },
                        {
                            header: 'Actions',
                            className: 'text-right',
                            cell: (session) => (
                                <div className="flex justify-end gap-2">
                                    {!session.is_active && (
                                        <Button variant="outline" size="sm" onClick={() => activate(session)}>
                                            Activate
                                        </Button>
                                    )}
                                    <Link
                                        href={route('admin.academic-sessions.edit', session.id)}
                                        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                                    >
                                        Edit
                                    </Link>
                                    <Button variant="destructive" size="sm" onClick={() => destroy(session)}>
                                        Delete
                                    </Button>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </AppLayout>
    );
}
