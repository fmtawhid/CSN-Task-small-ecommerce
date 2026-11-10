import { CommercePage, Field, FieldError } from '@/components/commerce';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type Shop = { id: number; owner_id: number; name: string; slug: string; description: string | null; logo: string | null; status: string };
type Owner = { id: number; name: string };

export default function ShopForm({ shop, owners }: { shop?: Shop; owners: Owner[] }) {
    const form = useForm({
        owner_id: shop?.owner_id?.toString() ?? '',
        name: shop?.name ?? '',
        slug: shop?.slug ?? '',
        description: shop?.description ?? '',
        status: shop?.status ?? 'active',
        logo: null as File | null,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (shop) {
            form.transform((data) => ({ ...data, _method: 'put' }));
            form.post(route('admin.shops.update', shop.id), { forceFormData: true });
        } else {
            form.post(route('admin.shops.store'), { forceFormData: true });
        }
    };

    return (
        <CommercePage title={shop ? 'Edit shop' : 'Create shop'}>
            <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-lg border bg-card p-6">
                <label className="grid gap-1.5 text-sm font-medium">Shop owner
                    <select className="rounded-md border bg-background px-3 py-2" value={form.data.owner_id} onChange={(e) => form.setData('owner_id', e.target.value)}>
                        <option value="">Select an owner</option>{owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.name}</option>)}
                    </select><FieldError message={form.errors.owner_id} />
                </label>
                <Field label="Shop name" value={form.data.name} required onChange={(value) => form.setData('name', value)} error={form.errors.name} />
                <Field label="Slug (optional)" value={form.data.slug} onChange={(value) => form.setData('slug', value)} error={form.errors.slug} />
                <label className="grid gap-1.5 text-sm font-medium">Description
                    <textarea className="rounded-md border bg-background px-3 py-2" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                </label><FieldError message={form.errors.description} />
                <label className="grid gap-1.5 text-sm font-medium">Logo (JPG, PNG, WebP; up to 2 MB)
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => form.setData('logo', e.target.files?.[0] ?? null)} />
                </label><FieldError message={form.errors.logo} />
                <label className="grid gap-1.5 text-sm font-medium">Status
                    <select className="rounded-md border bg-background px-3 py-2" value={form.data.status} onChange={(e) => form.setData('status', e.target.value)}>
                        <option value="active">Active</option><option value="inactive">Inactive</option>
                    </select>
                </label>
                <Button disabled={form.processing}>{shop ? 'Save shop' : 'Create shop'}</Button>
            </form>
        </CommercePage>
    );
}
