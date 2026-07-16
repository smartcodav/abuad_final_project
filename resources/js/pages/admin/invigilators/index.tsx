import { DataTable } from '@/components/admin/data-table';
import { Button, buttonVariants } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Invigilators', href: '/admin/invigilators' }];

interface Invigilator {
    id: number;
    phone: string | null;
    user: { id: number; name: string; email: string };
}

export default function InvigilatorsIndex({ invigilators }: { invigilators: Invigilator[] }) {
    const destroy = (invigilator: Invigilator) => {
        if (confirm(`Delete "${invigilator.user.name}"? This cannot be undone.`)) {
            router.delete(route('admin.invigilators.destroy', invigilator.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invigilators" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Invigilators</h1>
                    <Link href={route('admin.invigilators.create')} className={cn(buttonVariants())}>
                        New Invigilator
                    </Link>
                </div>

                <DataTable
                    data={invigilators}
                    rowKey={(invigilator) => invigilator.id}
                    columns={[
                        { header: 'Name', cell: (invigilator) => invigilator.user.name },
                        { header: 'Email', cell: (invigilator) => invigilator.user.email },
                        { header: 'Phone', cell: (invigilator) => invigilator.phone ?? '—' },
                        {
                            header: 'Actions',
                            className: 'text-right',
                            cell: (invigilator) => (
                                <div className="flex justify-end gap-2">
                                    <Link
                                        href={route('admin.invigilators.edit', invigilator.id)}
                                        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                                    >
                                        Edit
                                    </Link>
                                    <Button variant="destructive" size="sm" onClick={() => destroy(invigilator)}>
                                        Delete
                                    </Button>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </AppLayout>
    );
}
