import { DataTable } from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Semesters', href: '/admin/semesters' }];

interface Semester {
    id: number;
    name: string;
    is_active: boolean;
    academic_session: { id: number; name: string };
}

export default function SemestersIndex({ semesters }: { semesters: Semester[] }) {
    const destroy = (semester: Semester) => {
        if (confirm(`Delete "${semester.name}"? This cannot be undone.`)) {
            router.delete(route('admin.semesters.destroy', semester.id));
        }
    };

    const activate = (semester: Semester) => {
        router.post(route('admin.semesters.activate', semester.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Semesters" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Semesters</h1>
                    <Link href={route('admin.semesters.create')} className={cn(buttonVariants())}>
                        New Semester
                    </Link>
                </div>

                <DataTable
                    data={semesters}
                    rowKey={(semester) => semester.id}
                    columns={[
                        { header: 'Name', cell: (semester) => semester.name },
                        { header: 'Academic Session', cell: (semester) => semester.academic_session.name },
                        {
                            header: 'Status',
                            cell: (semester) => (semester.is_active ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>),
                        },
                        {
                            header: 'Actions',
                            className: 'text-right',
                            cell: (semester) => (
                                <div className="flex justify-end gap-2">
                                    {!semester.is_active && (
                                        <Button variant="outline" size="sm" onClick={() => activate(semester)}>
                                            Activate
                                        </Button>
                                    )}
                                    <Link
                                        href={route('admin.semesters.edit', semester.id)}
                                        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                                    >
                                        Edit
                                    </Link>
                                    <Button variant="destructive" size="sm" onClick={() => destroy(semester)}>
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
