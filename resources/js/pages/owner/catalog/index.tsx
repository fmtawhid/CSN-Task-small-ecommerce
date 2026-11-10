import { CommercePage, CommercePagination, FieldError } from '@/components/commerce';
import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types/models';
import { Link, router, useForm } from '@inertiajs/react';
import { Search, Store } from 'lucide-react';
import type { FormEvent } from 'react';

type CatalogProduct = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    thumbnail: string | null;
    listed_in_shop: boolean;
    creator: { name: string };
};

type Props = {
    products: Paginated<CatalogProduct>;
    filters: { search?: string; filter?: string };
};

export default function CatalogIndex({ products, filters }: Props) {
    const form = useForm({ search: filters.search ?? '', filter: filters.filter ?? '' });

    const search = (event: FormEvent) => {
        event.preventDefault();
        router.get(route('owner.catalog.index'), form.data, { preserveState: true, replace: true });
    };

    return (
        <CommercePage title="Shared product catalog">
            <section className="rounded-2xl bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 sm:p-8">
                <p className="text-sm font-semibold text-primary">Products from every seller</p>
                <h2 className="mt-2 text-2xl font-bold">Find products for your shop</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    Browse products created by the admin and other shop owners. Add a product to your shop with your own price, description, and image.
                </p>
                <Button asChild variant="outline" className="mt-5">
                    <Link href={route('owner.products.create')}>Create a new catalog product</Link>
                </Button>
            </section>

            <form onSubmit={search} className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-end">
                <label className="grid flex-1 gap-1.5 text-sm font-medium">
                    Search catalog
                    <span className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={form.data.search}
                            onChange={(event) => form.setData('search', event.target.value)}
                            placeholder="Search product name or description"
                            className="w-full rounded-md border bg-background py-2 pl-9 pr-3 font-normal"
                        />
                    </span>
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                    Show
                    <select
                        value={form.data.filter}
                        onChange={(event) => form.setData('filter', event.target.value)}
                        className="rounded-md border bg-background px-3 py-2 font-normal"
                    >
                        <option value="">All active products</option>
                        <option value="available">Not yet in my shop</option>
                    </select>
                </label>
                <Button type="submit">Search</Button>
            </form>

            {products.data.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {products.data.map((product) => <CatalogCard key={product.id} product={product} />)}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed p-10 text-center">
                    <Store className="mx-auto size-9 text-muted-foreground" />
                    <p className="mt-3 font-medium">No products match your search</p>
                    <p className="mt-1 text-sm text-muted-foreground">Try another search or add a new product to the catalog.</p>
                </div>
            )}

            <CommercePagination links={products.links} />
        </CommercePage>
    );
}

function CatalogCard({ product }: { product: CatalogProduct }) {
    const form = useForm({ price: '' });
    const add = (event: FormEvent) => {
        event.preventDefault();
        form.post(route('owner.catalog.store', product.id), { preserveScroll: true });
    };

    return (
        <article className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <img src={product.thumbnail ? `/storage/${product.thumbnail}` : '/images/product-placeholder.svg'} onError={(event) => { event.currentTarget.src = '/images/product-placeholder.svg'; }} alt={product.name} className="h-48 w-full bg-muted object-cover" />
            <div className="space-y-3 p-5">
                <p className="text-xs font-medium text-primary">Added by {product.creator.name}</p>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="line-clamp-3 min-h-15 text-sm text-muted-foreground">{product.description || 'No catalog description provided.'}</p>
                {product.listed_in_shop ? (
                    <div className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        Already listed in your shop
                    </div>
                ) : (
                    <form onSubmit={add} className="space-y-2 border-t pt-3">
                        <label className="grid gap-1 text-sm font-medium">
                            Your shop price
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                required
                                value={form.data.price}
                                onChange={(event) => form.setData('price', event.target.value)}
                                className="rounded-md border bg-background px-3 py-2 font-normal"
                            />
                        </label>
                        <FieldError message={Object.values(form.errors)[0]} />
                        <Button type="submit" className="w-full" disabled={form.processing}>Add to my shop</Button>
                    </form>
                )}
            </div>
        </article>
    );
}
