import { CommercePage, Field, FieldError } from '@/components/commerce';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

export default function OwnerForm({ owner }: { owner?: { id: number; name: string; email: string } }) {
    const form = useForm({ name: owner?.name ?? '', email: owner?.email ?? '', password: '', password_confirmation: '' });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        owner ? form.put(route('admin.owners.update', owner.id)) : form.post(route('admin.owners.store'));
    };

    return (
        <CommercePage title={owner ? 'Edit shop owner' : 'Create shop owner'}>
            <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-lg border bg-card p-6">
                <Field label="Name" value={form.data.name} required onChange={(value) => form.setData('name', value)} error={form.errors.name} />
                <Field label="Email" type="email" value={form.data.email} required onChange={(value) => form.setData('email', value)} error={form.errors.email} />
                <Field label={owner ? 'New password (optional)' : 'Password'} type="password" value={form.data.password} required={!owner} onChange={(value) => form.setData('password', value)} error={form.errors.password} />
                <Field label="Confirm password" type="password" value={form.data.password_confirmation} required={!owner} onChange={(value) => form.setData('password_confirmation', value)} />
                <FieldError message={form.errors.password_confirmation} />
                <Button type="submit" disabled={form.processing}>{owner ? 'Save changes' : 'Create account'}</Button>
            </form>
        </CommercePage>
    );
}
