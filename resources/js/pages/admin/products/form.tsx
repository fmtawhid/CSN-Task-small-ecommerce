import { CommercePage, Field, FieldError } from '@/components/commerce';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type Product = { id: number; name: string; slug: string; description: string | null; thumbnail: string | null; is_active: boolean };

export default function ProductForm({ product }: { product?: Product }) {
    const form = useForm({
        name: product?.name ?? '', slug: product?.slug ?? '', description: product?.description ?? '',
        is_active: product?.is_active ?? true, thumbnail: null as File | null,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (product) {
            form.transform((data) => ({ ...data, _method: 'put' }));
            form.post(route('admin.products.update', product.id), { forceFormData: true });
        } else {
            form.post(route('admin.products.store'), { forceFormData: true });
        }
    };

    return (
        <CommercePage title={product ? 'Edit catalog product' : 'Create catalog product'}>
            <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-lg border bg-card p-6">
                <Field label="Name" value={form.data.name} required onChange={(value) => form.setData('name', value)} error={form.errors.name} />
                <Field label="Slug (optional)" value={form.data.slug} onChange={(value) => form.setData('slug', value)} error={form.errors.slug} />
                <label className="grid gap-1.5 text-sm font-medium">Description
                    <textarea className="rounded-md border bg-background px-3 py-2" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                </label><FieldError message={form.errors.description} />
                <label className="grid gap-1.5 text-sm font-medium">Global thumbnail (JPG, PNG, WebP; up to 2 MB)
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => form.setData('thumbnail', e.target.files?.[0] ?? null)} />
                </label><FieldError message={form.errors.thumbnail} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} /> Catalog product active</label>
                <Button disabled={form.processing}>{product ? 'Save product' : 'Create product'}</Button>
            </form>
        </CommercePage>
    );
}
