import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StudentOnboardingLayout from '@/layouts/student-onboarding-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function SetDemographics({ gender, dateOfBirth }: { gender: string | null; dateOfBirth: string | null }) {
    const { data, setData, post, processing, errors } = useForm({
        gender: gender ?? '',
        date_of_birth: dateOfBirth ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('student.onboarding.step3.store'));
    };

    return (
        <StudentOnboardingLayout step={3}>
            <Head title="Your Details" />

            <Card>
                <CardHeader>
                    <CardTitle>Gender &amp; Date of Birth</CardTitle>
                    <CardDescription>These details help verify your identity during examinations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                <SelectTrigger id="gender">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.gender} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date_of_birth">Date of Birth</Label>
                            <Input
                                id="date_of_birth"
                                type="date"
                                required
                                value={data.date_of_birth}
                                onChange={(e) => setData('date_of_birth', e.target.value)}
                            />
                            <InputError message={errors.date_of_birth} />
                        </div>

                        <Button disabled={processing}>Continue</Button>
                    </form>
                </CardContent>
            </Card>
        </StudentOnboardingLayout>
    );
}
