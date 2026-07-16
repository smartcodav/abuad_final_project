import { DataTable } from '@/components/admin/data-table';
import { Button, buttonVariants } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Courses', href: '/admin/courses' }];

interface Course {
    id: number;
    code: string;
    title: string;
    level: number;
    unit: number | null;
    department: { id: number; name: string; school: { id: number; name: string } };
}

export default function CoursesIndex({ courses }: { courses: Course[] }) {
    const destroy = (course: Course) => {
        if (confirm(`Delete "${course.code} - ${course.title}"? This cannot be undone.`)) {
            router.delete(route('admin.courses.destroy', course.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Courses</h1>
                    <Link href={route('admin.courses.create')} className={cn(buttonVariants())}>
                        New Course
                    </Link>
                </div>

                <DataTable
                    data={courses}
                    rowKey={(course) => course.id}
                    columns={[
                        { header: 'Code', cell: (course) => course.code },
                        { header: 'Title', cell: (course) => course.title },
                        { header: 'Level', cell: (course) => `${course.level} Level` },
                        { header: 'Unit', cell: (course) => course.unit ?? '—' },
                        { header: 'Department', cell: (course) => course.department.name },
                        {
                            header: 'Actions',
                            className: 'text-right',
                            cell: (course) => (
                                <div className="flex justify-end gap-2">
                                    <Link href={route('admin.courses.edit', course.id)} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
                                        Edit
                                    </Link>
                                    <Button variant="destructive" size="sm" onClick={() => destroy(course)}>
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
