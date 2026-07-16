import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Academic Sessions', href: '/admin/academic-sessions' },
    { title: 'Edit Session', href: '#' },
];

interface AcademicSession {
    id: number;
    name: string;
}

export default function EditAcademicSession({ academicSession }: { academicSession: AcademicSession }) {
    const { data, setData, put, processing, errors } = useForm({
        name: academicSession.name,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.academic-sessions.update', academicSession.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Academic Session" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-xl font-semibold">Edit Academic Session</h1>

                <form onSubmit={submit} className="max-w-lg space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>

                    <Button disabled={processing}>Save Changes</Button>
                </form>
            </div>
        </AppLayout>
    );
}
