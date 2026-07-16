import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Schools', href: '/admin/schools' },
    { title: 'New School', href: '/admin/schools/create' },
];

export default function CreateSchool() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.schools.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New School" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-xl font-semibold">New School</h1>

                <form onSubmit={submit} className="max-w-lg space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="code">Code</Label>
                        <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} placeholder="e.g. CCCS" />
                        <InputError message={errors.code} />
                    </div>

                    <Button disabled={processing}>Create School</Button>
                </form>
            </div>
        </AppLayout>
    );
}
