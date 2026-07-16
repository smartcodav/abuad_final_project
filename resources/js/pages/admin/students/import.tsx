import InputError from '@/components/input-error';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Students', href: '/admin/students' },
    { title: 'Bulk Import', href: '/admin/students-import' },
];

export default function ImportStudents() {
    const { data, setData, post, processing, errors } = useForm<{ file: File | null }>({
        file: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.students.import.store'), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bulk Import Students" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-xl font-semibold">Bulk Import Students</h1>

                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle className="text-base">Upload a spreadsheet</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-sm text-muted-foreground">
                            Columns required: matric_number, full_name, department, level, default_password (optional, defaults to 1234567),
                            exam_username, exam_password.
                        </p>

                        <a href={route('admin.students.import.template')} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
                            Download CSV Template
                        </a>

                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="file">Spreadsheet file (.xlsx or .csv)</Label>
                                <input
                                    id="file"
                                    type="file"
                                    accept=".xlsx,.csv"
                                    onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                                    className="text-sm"
                                    required
                                />
                                <InputError message={errors.file} />
                            </div>

                            <Button disabled={processing || !data.file}>Upload &amp; Import</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
