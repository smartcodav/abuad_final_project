import { DataTable } from '@/components/admin/data-table';
import { Button, buttonVariants } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Departments', href: '/admin/departments' }];

interface Department {
    id: number;
    name: string;
    code: string | null;
    students_count: number;
    school: { id: number; name: string };
}

export default function DepartmentsIndex({ departments }: { departments: Department[] }) {
    const destroy = (department: Department) => {
        if (confirm(`Delete "${department.name}"? This cannot be undone.`)) {
            router.delete(route('admin.departments.destroy', department.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Departments</h1>
                    <Link href={route('admin.departments.create')} className={cn(buttonVariants())}>
                        New Department
                    </Link>
                </div>

                <DataTable
                    data={departments}
                    rowKey={(department) => department.id}
                    columns={[
                        { header: 'Name', cell: (department) => department.name },
                        { header: 'Code', cell: (department) => department.code ?? '—' },
                        { header: 'School', cell: (department) => department.school.name },
                        { header: 'Students', cell: (department) => department.students_count },
                        {
                            header: 'Actions',
                            className: 'text-right',
                            cell: (department) => (
                                <div className="flex justify-end gap-2">
                                    <Link
                                        href={route('admin.departments.edit', department.id)}
                                        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                                    >
                                        Edit
                                    </Link>
                                    <Button variant="destructive" size="sm" onClick={() => destroy(department)}>
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
