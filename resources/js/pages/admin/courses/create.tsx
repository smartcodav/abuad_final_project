import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Courses', href: '/admin/courses' },
    { title: 'New Course', href: '/admin/courses/create' },
];

const LEVELS = [100, 200, 300, 400, 500];

interface Department {
    id: number;
    name: string;
    school: { id: number; name: string };
}

export default function CreateCourse({ departments }: { departments: Department[] }) {
    const { data, setData, post, processing, errors } = useForm({
        department_id: '',
        level: '',
        code: '',
        title: '',
        unit: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.courses.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Course" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-xl font-semibold">New Course</h1>

                <form onSubmit={submit} className="max-w-lg space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="department_id">Department</Label>
                        <Select value={data.department_id} onValueChange={(value) => setData('department_id', value)}>
                            <SelectTrigger id="department_id">
                                <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((department) => (
                                    <SelectItem key={department.id} value={String(department.id)}>
                                        {department.name} ({department.school.name})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.department_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="level">Level</Label>
                        <Select value={data.level} onValueChange={(value) => setData('level', value)}>
                            <SelectTrigger id="level">
                                <SelectValue placeholder="Select a level" />
                            </SelectTrigger>
                            <SelectContent>
                                {LEVELS.map((level) => (
                                    <SelectItem key={level} value={String(level)}>
                                        {level} Level
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.level} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="code">Course Code</Label>
                        <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} placeholder="e.g. CSC201" required />
                        <InputError message={errors.code} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Input
                            id="unit"
                            type="number"
                            min={1}
                            max={10}
                            value={data.unit}
                            onChange={(e) => setData('unit', e.target.value)}
                        />
                        <InputError message={errors.unit} />
                    </div>

                    <Button disabled={processing}>Create Course</Button>
                </form>
            </div>
        </AppLayout>
    );
}
