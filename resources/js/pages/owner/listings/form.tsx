import { CommercePage, Field, FieldError } from '@/components/commerce';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type Listing = {
    id: number; price: string; description: string | null; thumbnail: string | null; is_active: boolean;
    product: { name: string; description: string | null; thumbnail: string | null; is_active: boolean };
};

export default function ListingForm({ listing }: { listing: Listing }) {
    const form = useForm({
        price: listing.price, description: listing.description ?? '', is_active: listing.is_active, thumbnail: null as File | null,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform((data) => ({ ...data, _method: 'put' }));
        form.post(route('owner.listings.update', listing.id), { forceFormData: true });
    };

    return (
        <CommercePage title={`Edit ${listing.product.name}`}>
            <p className="text-sm text-muted-foreground">Product status: {listing.product.is_active ? 'active' : 'inactive'}</p>
            <p className="text-sm text-muted-foreground">Catalog image is used unless you upload a shop-specific image.</p>
            <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-lg border bg-card p-6">
                <Field label="Shop price" type="number" value={form.data.price} required onChange={(value) => form.setData('price', value)} error={form.errors.price} />
                <label className="grid gap-1.5 text-sm font-medium">Shop-specific description
                    <textarea className="rounded-md border bg-background px-3 py-2" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                </label><FieldError message={form.errors.description} />
                <label className="grid gap-1.5 text-sm font-medium">Replace product image (optional)
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => form.setData('thumbnail', e.target.files?.[0] ?? null)} />
                </label><FieldError message={form.errors.thumbnail} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} /> Listing published</label>
                <Button disabled={form.processing}>Save listing</Button>
            </form>
        </CommercePage>
    );
}
