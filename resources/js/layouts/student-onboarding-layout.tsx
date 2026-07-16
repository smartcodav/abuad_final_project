import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
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
        <div className="relative mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-8 overflow-hidden p-6">
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden print:hidden">
                <div className="absolute -top-32 -right-24 size-80 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute bottom-0 -left-24 size-80 rounded-full bg-[hsl(316,74%,57%)]/15 blur-3xl" />
            </div>

            <ol className="flex flex-wrap items-center gap-x-2 gap-y-3 text-sm print:hidden">
                {STEPS.map((item, index) => (
                    <li key={item.step} className="flex items-center gap-2">
                        <span
                            className={cn(
                                'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-all',
                                item.step === step
                                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/40 ring-2 ring-primary/30'
                                    : item.step < step
                                      ? 'bg-primary/15 text-primary'
                                      : 'bg-muted text-muted-foreground',
                            )}
                        >
                            {item.step < step ? <Check className="size-3.5" /> : item.step}
                        </span>
                        <span className={cn(item.step === step ? 'font-medium text-foreground' : 'text-muted-foreground')}>{item.label}</span>
                        {index < STEPS.length - 1 && (
                            <span className={cn('h-px w-4', item.step < step ? 'bg-primary/40' : 'bg-border')} />
                        )}
                    </li>
                ))}
            </ol>

            <div className="flex-1">{children}</div>
        </div>
    );
}
