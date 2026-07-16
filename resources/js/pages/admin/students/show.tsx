import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Students', href: '/admin/students' },
    { title: 'Student Details', href: '#' },
];

interface CourseRegistration {
    id: number;
    course: { code: string; title: string };
}

interface Student {
    id: number;
    level: number;
    onboarding_step: number;
    onboarding_completed_at: string | null;
    exam_username: string | null;
    user: { name: string; matric_number: string; email: string };
    department: { name: string; school: { name: string } };
    course_registrations: CourseRegistration[];
}

export default function ShowStudent({ student }: { student: Student }) {
    const resetPassword = () => {
        if (confirm('Reset this student’s password to the default (1234567) and force a change on next login?')) {
            router.post(route('admin.students.reset-password', student.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${student.user.name} - Student Details`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">{student.user.name}</h1>
                    <Button variant="outline" onClick={resetPassword}>
                        Reset Password
                    </Button>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-base">Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Matric Number</p>
                            <p className="font-medium">{student.user.matric_number}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium">{student.user.email}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Department</p>
                            <p className="font-medium">{student.department.name}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">School</p>
                            <p className="font-medium">{student.department.school.name}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Level</p>
                            <p className="font-medium">{student.level} Level</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Onboarding</p>
                            <p className="font-medium">
                                {student.onboarding_completed_at ? (
                                    <Badge>Completed</Badge>
                                ) : (
                                    <Badge variant="secondary">Step {student.onboarding_step} / 6</Badge>
                                )}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-base">Registered Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {student.course_registrations.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No courses registered yet.</p>
                        ) : (
                            <ul className="list-inside list-disc text-sm">
                                {student.course_registrations.map((registration) => (
                                    <li key={registration.id}>
                                        {registration.course.code} - {registration.course.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
