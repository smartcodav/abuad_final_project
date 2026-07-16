import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StudentOnboardingLayout from '@/layouts/student-onboarding-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function SetEmail({ email }: { email: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('student.onboarding.step2.store'));
    };

    return (
        <StudentOnboardingLayout step={2}>
            <Head title="Set Your Email" />

            <Card>
                <CardHeader>
                    <CardTitle>Set Your Email Address</CardTitle>
                    <CardDescription>This email will be used for important notifications about your exams.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="you@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <Button disabled={processing}>Continue</Button>
                    </form>
                </CardContent>
            </Card>
        </StudentOnboardingLayout>
    );
}
