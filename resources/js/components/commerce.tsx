import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

export function CommercePage({ title, children }: { title: string; children: ReactNode }) {
    return (
        <AppLayout>
            <Head title={title} />
            <div className="mx-auto max-w-7xl space-y-6">
                <h1 className="text-2xl font-bold">{title}</h1>
                {children}
            </div>
        </AppLayout>
    );
}

export function CommercePagination({ links }: { links: { url: string | null; label: string; active: boolean }[] }) {
    return <Pagination links={links} />;
}

export function FieldError({ message }: { message?: string }) {
    return message ? <p className="text-sm text-destructive">{message}</p> : null;
}

export function Field({
    label,
    value,
    onChange,
    type = 'text',
    required = false,
    error,
}: {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
    error?: string;
}) {
    return (
        <label className="grid gap-1.5 text-sm font-medium">
            {label}
            <input
                type={type}
                step={type === 'number' ? 'any' : undefined}
                value={value}
                required={required}
                onChange={(event) => onChange(event.target.value)}
                className="rounded-md border bg-background px-3 py-2 font-normal"
            />
            <FieldError message={error} />
        </label>
    );
}
