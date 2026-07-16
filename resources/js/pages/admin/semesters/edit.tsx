import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Semesters', href: '/admin/semesters' },
    { title: 'Edit Semester', href: '#' },
];

interface AcademicSession {
    id: number;
    name: string;
}

interface Semester {
    id: number;
    name: string;
    academic_session_id: number;
}

export default function EditSemester({ semester, academicSessions }: { semester: Semester; academicSessions: AcademicSession[] }) {
    const { data, setData, put, processing, errors } = useForm({
        academic_session_id: String(semester.academic_session_id),
        name: semester.name,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.semesters.update', semester.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Semester" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-xl font-semibold">Edit Semester</h1>

                <form onSubmit={submit} className="max-w-lg space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="academic_session_id">Academic Session</Label>
                        <Select value={data.academic_session_id} onValueChange={(value) => setData('academic_session_id', value)}>
                            <SelectTrigger id="academic_session_id">
                                <SelectValue placeholder="Select a session" />
                            </SelectTrigger>
                            <SelectContent>
                                {academicSessions.map((session) => (
                                    <SelectItem key={session.id} value={String(session.id)}>
                                        {session.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.academic_session_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Select value={data.name} onValueChange={(value) => setData('name', value)}>
                            <SelectTrigger id="name">
                                <SelectValue placeholder="Select a semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="First">First</SelectItem>
                                <SelectItem value="Second">Second</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.name} />
                    </div>

                    <Button disabled={processing}>Save Changes</Button>
                </form>
            </div>
        </AppLayout>
    );
}
