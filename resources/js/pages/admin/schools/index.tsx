import { DataTable } from '@/components/admin/data-table';
import { Button, buttonVariants } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Schools', href: '/admin/schools' }];

interface School {
    id: number;
    name: string;
    code: string | null;
    departments_count: number;
}

export default function SchoolsIndex({ schools }: { schools: School[] }) {
    const destroy = (school: School) => {
        if (confirm(`Delete "${school.name}"? This cannot be undone.`)) {
            router.delete(route('admin.schools.destroy', school.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schools" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Schools</h1>
                    <Link href={route('admin.schools.create')} className={cn(buttonVariants())}>
                        New School
                    </Link>
                </div>

                <DataTable
                    data={schools}
                    rowKey={(school) => school.id}
                    columns={[
                        { header: 'Name', cell: (school) => school.name },
                        { header: 'Code', cell: (school) => school.code ?? '—' },
                        { header: 'Departments', cell: (school) => school.departments_count },
                        {
                            header: 'Actions',
                            className: 'text-right',
                            cell: (school) => (
                                <div className="flex justify-end gap-2">
                                    <Link href={route('admin.schools.edit', school.id)} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
                                        Edit
                                    </Link>
                                    <Button variant="destructive" size="sm" onClick={() => destroy(school)}>
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
