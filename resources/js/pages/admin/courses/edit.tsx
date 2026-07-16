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
    { title: 'Edit Course', href: '#' },
];

const LEVELS = [100, 200, 300, 400, 500];

interface Department {
    id: number;
    name: string;
    school: { id: number; name: string };
}

interface Course {
    id: number;
    department_id: number;
    level: number;
    code: string;
    title: string;
    unit: number | null;
}

export default function EditCourse({ course, departments }: { course: Course; departments: Department[] }) {
    const { data, setData, put, processing, errors } = useForm({
        department_id: String(course.department_id),
        level: String(course.level),
        code: course.code,
        title: course.title,
        unit: course.unit ? String(course.unit) : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.courses.update', course.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Course" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-xl font-semibold">Edit Course</h1>

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
                        <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} required />
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

                    <Button disabled={processing}>Save Changes</Button>
                </form>
            </div>
        </AppLayout>
    );
}
