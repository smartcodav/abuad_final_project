import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/admin/dashboard' }];

interface Stats {
    schools: number;
    departments: number;
    students: number;
    invigilators: number;
    courses: number;
    activeSession: string | null;
}

export default function AdminDashboard({ stats }: { stats: Stats }) {
    const tiles: { label: string; value: string | number }[] = [
        { label: 'Schools', value: stats.schools },
        { label: 'Departments', value: stats.departments },
        { label: 'Students', value: stats.students },
        { label: 'Invigilators', value: stats.invigilators },
        { label: 'Courses', value: stats.courses },
        { label: 'Active Session', value: stats.activeSession ?? 'None active' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {tiles.map((tile) => (
                        <Card key={tile.label}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{tile.label}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-semibold">{tile.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
