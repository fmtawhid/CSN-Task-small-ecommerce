import { CommercePage, Field, FieldError } from '@/components/commerce';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

export default function NewProductForm() {
    const form = useForm({
        name: '',
        description: '',
        thumbnail: null as File | null,
        price: '',
        shop_description: '',
        shop_thumbnail: null as File | null,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(route('owner.products.store'), { forceFormData: true });
    };

    return (
        <CommercePage title="Add your product">
            <p className="text-sm text-muted-foreground">
                Your product will appear in the shared catalog. Your price, description, and image below are customized for your shop.
            </p>
            <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-lg border bg-card p-6">
                <Field label="Product name" value={form.data.name} required onChange={(value) => form.setData('name', value)} error={form.errors.name} />
                <label className="grid gap-1.5 text-sm font-medium">Product description
                    <textarea className="rounded-md border bg-background px-3 py-2" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                </label><FieldError message={form.errors.description} />
                <label className="grid gap-1.5 text-sm font-medium">Catalog image (JPG, PNG, or WebP; up to 2 MB)
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => form.setData('thumbnail', e.target.files?.[0] ?? null)} />
                </label><FieldError message={form.errors.thumbnail} />
                <Field label="Your shop price" type="number" value={form.data.price} required onChange={(value) => form.setData('price', value)} error={form.errors.price} />
                <label className="grid gap-1.5 text-sm font-medium">Shop-specific description (optional)
                    <textarea className="rounded-md border bg-background px-3 py-2" value={form.data.shop_description} onChange={(e) => form.setData('shop_description', e.target.value)} />
                </label><FieldError message={form.errors.shop_description} />
                <label className="grid gap-1.5 text-sm font-medium">Shop-specific image (optional; overrides catalog image)
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => form.setData('shop_thumbnail', e.target.files?.[0] ?? null)} />
                </label><FieldError message={form.errors.shop_thumbnail} />
                <Button disabled={form.processing}>Add product to my shop</Button>
            </form>
        </CommercePage>
    );
}
