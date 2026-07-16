import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StudentOnboardingLayout from '@/layouts/student-onboarding-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ConfirmIdentity({ fullName, matricNumber }: { fullName: string; matricNumber: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('student.onboarding.step1.store'));
    };

    return (
        <StudentOnboardingLayout step={1}>
            <Head title="Confirm Your Identity" />

            <Card>
                <CardHeader>
                    <CardTitle>Confirm Your Identity</CardTitle>
                    <CardDescription>Please confirm the details below are correct before continuing.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 rounded-md border p-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Full Name</p>
                            <p className="text-lg font-medium">{fullName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Matriculation Number</p>
                            <p className="text-lg font-medium">{matricNumber}</p>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        If any of this information is incorrect, please contact your department or exams office before proceeding.
                    </p>

                    <form onSubmit={submit}>
                        <Button disabled={processing}>This is correct, continue</Button>
                    </form>
                </CardContent>
            </Card>
        </StudentOnboardingLayout>
    );
}
