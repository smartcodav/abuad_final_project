import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StudentOnboardingLayout from '@/layouts/student-onboarding-layout';
import { Head, router } from '@inertiajs/react';

interface StudentSummary {
    name: string;
    matricNumber: string;
    department: string;
    school: string;
    level: number;
    photoUrl: string | null;
}

export default function PrintOnboardingSummary({ student }: { student: StudentSummary }) {
    const finish = () => {
        router.post(route('student.onboarding.complete'));
    };

    return (
        <StudentOnboardingLayout step={6}>
            <Head title="Onboarding Complete" />

            <Card>
                <CardHeader>
                    <CardTitle>You're All Set</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6 rounded-md border p-6">
                        {student.photoUrl ? (
                            <img src={student.photoUrl} alt={student.name} className="h-32 w-32 rounded-md object-cover" />
                        ) : (
                            <div className="flex h-32 w-32 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                                No Photo
                            </div>
                        )}

                        <div className="space-y-1 text-sm">
                            <p className="text-lg font-semibold">{student.name}</p>
                            <p>
                                <span className="text-muted-foreground">Matric Number:</span> {student.matricNumber}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Department:</span> {student.department}
                            </p>
                            <p>
                                <span className="text-muted-foreground">School:</span> {student.school}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Level:</span> {student.level} Level
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 print:hidden">
                        <Button variant="outline" onClick={() => window.print()}>
                            Print
                        </Button>
                        <Button onClick={finish}>Continue to Dashboard</Button>
                    </div>
                </CardContent>
            </Card>
        </StudentOnboardingLayout>
    );
}
