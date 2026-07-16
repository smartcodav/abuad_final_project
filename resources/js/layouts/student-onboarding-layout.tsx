import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

const STEPS = [
    { step: 1, label: 'Confirm Identity' },
    { step: 2, label: 'Email' },
    { step: 3, label: 'Demographics' },
    { step: 4, label: 'Face Capture' },
    { step: 5, label: 'Course Registration' },
    { step: 6, label: 'Print' },
];

export default function StudentOnboardingLayout({ step, children }: { step: number; children: ReactNode }) {
    return (
        <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-8 p-6">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-3 text-sm">
                {STEPS.map((item, index) => (
                    <li key={item.step} className="flex items-center gap-2">
                        <span
                            className={cn(
                                'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                                item.step === step
                                    ? 'bg-primary text-primary-foreground'
                                    : item.step < step
                                      ? 'bg-primary/20 text-primary'
                                      : 'bg-muted text-muted-foreground',
                            )}
                        >
                            {item.step}
                        </span>
                        <span className={cn(item.step === step ? 'font-medium' : 'text-muted-foreground')}>{item.label}</span>
                        {index < STEPS.length - 1 && <span className="text-muted-foreground">&rarr;</span>}
                    </li>
                ))}
            </ol>

            <div className="flex-1">{children}</div>
        </div>
    );
}
