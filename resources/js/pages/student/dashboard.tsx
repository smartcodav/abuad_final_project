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
}

export default function StudentDashboard({ student }: { student: StudentSummary }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-xl font-semibold">Welcome, {student.name}</h1>

                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle className="text-base">Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
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
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
