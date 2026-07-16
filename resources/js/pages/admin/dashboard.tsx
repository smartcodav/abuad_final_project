import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BookOpen, Building2, CalendarRange, GraduationCap, LucideIcon, ShieldCheck, UsersRound } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/admin/dashboard' }];

interface Stats {
    schools: number;
    departments: number;
    students: number;
    invigilators: number;
    courses: number;
    activeSession: string | null;
}

// Full class strings (not interpolated) so Tailwind's static scanner can find them.
const ICON_COLOR_CLASSES = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
    violet: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    pink: 'bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400',
    cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400',
} as const;

interface Tile {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: keyof typeof ICON_COLOR_CLASSES;
}

export default function AdminDashboard({ stats }: { stats: Stats }) {
    const tiles: Tile[] = [
        { label: 'Schools', value: stats.schools, icon: Building2, color: 'blue' },
        { label: 'Departments', value: stats.departments, icon: GraduationCap, color: 'violet' },
        { label: 'Students', value: stats.students, icon: UsersRound, color: 'emerald' },
        { label: 'Invigilators', value: stats.invigilators, icon: ShieldCheck, color: 'amber' },
        { label: 'Courses', value: stats.courses, icon: BookOpen, color: 'pink' },
        { label: 'Active Session', value: stats.activeSession ?? 'None active', icon: CalendarRange, color: 'cyan' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {tiles.map((tile) => (
                        <Card key={tile.label} className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{tile.label}</CardTitle>
                                <div className={`flex size-9 items-center justify-center rounded-lg ${ICON_COLOR_CLASSES[tile.color]}`}>
                                    <tile.icon className="size-4.5" />
                                </div>
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
