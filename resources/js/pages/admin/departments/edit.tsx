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
    { title: 'Departments', href: '/admin/departments' },
    { title: 'Edit Department', href: '#' },
];

interface School {
    id: number;
    name: string;
}

interface Department {
    id: number;
    name: string;
    code: string | null;
    school_id: number;
}

export default function EditDepartment({ department, schools }: { department: Department; schools: School[] }) {
    const { data, setData, put, processing, errors } = useForm({
        school_id: String(department.school_id),
        name: department.name,
        code: department.code ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.departments.update', department.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Department" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-xl font-semibold">Edit Department</h1>

                <form onSubmit={submit} className="max-w-lg space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="school_id">School</Label>
                        <Select value={data.school_id} onValueChange={(value) => setData('school_id', value)}>
                            <SelectTrigger id="school_id">
                                <SelectValue placeholder="Select a school" />
                            </SelectTrigger>
                            <SelectContent>
                                {schools.map((school) => (
                                    <SelectItem key={school.id} value={String(school.id)}>
                                        {school.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.school_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="code">Code</Label>
                        <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} />
                        <InputError message={errors.code} />
                    </div>

                    <Button disabled={processing}>Save Changes</Button>
                </form>
            </div>
        </AppLayout>
    );
}
