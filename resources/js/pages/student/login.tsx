import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function StudentLogin({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        matric_number: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('student.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Student Login" description="Log in with your matriculation number and password">
            <Head title="Student Login" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="matric_number">Matriculation Number</Label>
                        <Input
                            id="matric_number"
                            required
                            autoFocus
                            autoComplete="username"
                            value={data.matric_number}
                            onChange={(e) => setData('matric_number', e.target.value)}
                            placeholder="e.g. CSC/2021/001"
                        />
                        <InputError message={errors.matric_number} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <Button type="submit" className="mt-4 w-full" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Log in
                    </Button>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
