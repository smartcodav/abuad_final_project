import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/student/dashboard' }];

interface StudentSummary {
    name: string;
    matricNumber: string;
    department: string;
    school: string;
    level: number;
    photoUrl: string | null;
}

interface Course {
    id: number;
    code: string;
    title: string;
    unit: number | null;
}

export default function StudentDashboard({ student, courses }: { student: StudentSummary; courses: Course[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-xl font-semibold">Welcome, {student.name}</h1>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            {student.photoUrl && <img src={student.photoUrl} alt={student.name} className="h-20 w-20 rounded-md object-cover" />}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Matric Number</p>
                                    <p className="font-medium">{student.matricNumber}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Department</p>
                                    <p className="font-medium">{student.department}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">School</p>
                                    <p className="font-medium">{student.school}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Level</p>
                                    <p className="font-medium">{student.level} Level</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Registered Courses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {courses.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No courses registered yet.</p>
                            ) : (
                                <ul className="space-y-1 text-sm">
                                    {courses.map((course) => (
                                        <li key={course.id}>
                                            <span className="font-medium">{course.code}</span> — {course.title}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
