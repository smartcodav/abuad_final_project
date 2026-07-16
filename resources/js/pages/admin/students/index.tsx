import { DataTable } from '@/components/admin/data-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Students', href: '/admin/students' }];

interface Student {
    id: number;
    matric_number: string;
    name: string;
    department: string;
    school: string;
    level: number;
    onboarding_step: number;
    onboarding_completed: boolean;
}

interface ImportFailure {
    row: number;
    attribute: string;
    errors: string[];
}

interface ImportResult {
    imported: number;
    failures: ImportFailure[];
}

export default function StudentsIndex({ students, importResult }: { students: Student[]; importResult?: ImportResult | null }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Students</h1>
                    <Link href={route('admin.students.import.create')} className={cn(buttonVariants())}>
                        Bulk Import
                    </Link>
                </div>

                {importResult && (
                    <Alert>
                        <AlertTitle>Import complete</AlertTitle>
                        <AlertDescription>
                            <p>{importResult.imported} student(s) imported successfully.</p>
                            {importResult.failures.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    <p className="font-medium">{importResult.failures.length} row(s) failed:</p>
                                    <ul className="list-inside list-disc">
                                        {importResult.failures.map((failure, index) => (
                                            <li key={index}>
                                                Row {failure.row} ({failure.attribute}): {failure.errors.join(', ')}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                <DataTable
                    data={students}
                    rowKey={(student) => student.id}
                    columns={[
                        { header: 'Matric Number', cell: (student) => student.matric_number },
                        { header: 'Name', cell: (student) => student.name },
                        { header: 'Department', cell: (student) => student.department },
                        { header: 'School', cell: (student) => student.school },
                        { header: 'Level', cell: (student) => `${student.level} Level` },
                        {
                            header: 'Onboarding',
                            cell: (student) =>
                                student.onboarding_completed ? (
                                    <Badge>Completed</Badge>
                                ) : (
                                    <Badge variant="secondary">Step {student.onboarding_step} / 6</Badge>
                                ),
                        },
                        {
                            header: 'Actions',
                            className: 'text-right',
                            cell: (student) => (
                                <Link href={route('admin.students.show', student.id)} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
                                    View
                                </Link>
                            ),
                        },
                    ]}
                />
            </div>
        </AppLayout>
    );
}
