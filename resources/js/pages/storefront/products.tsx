import { CommercePagination } from '@/components/commerce';
import MarketplaceNav from '@/components/marketplace-nav';
import { Head, Link, router, useForm } from '@inertiajs/react';
import type { Paginated } from '@/types/models';
import { ArrowUpRight, Search, ShoppingBag } from 'lucide-react';
import type { FormEvent } from 'react';

type ProductListing = {
    id: number;
    price: string;
    description: string | null;
    thumbnail: string | null;
    shop: { id: number; name: string; slug: string };
    product: { id: number; name: string; slug: string; description: string | null; thumbnail: string | null };
};

export default function ProductsIndex({ products, filters }: {
    products: Paginated<ProductListing>;
    filters: { search?: string };
}) {
    const form = useForm({ search: filters.search ?? '' });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get(route('storefront.products.index'), { search: form.data.search }, { preserveState: true, replace: true });
    };

    return (
        <main className="min-h-screen bg-white text-slate-900">
            <Head title="All products" />
            <MarketplaceNav />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <header className="flex flex-wrap items-end justify-between gap-5">
                    <div>
                        <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Browse the marketplace</p>
                        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">All products</h1>
                        <p className="mt-2 text-sm text-slate-500">Discover products from every active shop.</p>
                    </div>
                    <Link href={route('storefront.stores.index')} className="text-sm font-bold text-emerald-700 hover:text-emerald-800">Browse all shops <span aria-hidden="true">→</span></Link>
                </header>

                <form onSubmit={submit} role="search" className="mt-7 flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
                    <label className="relative min-w-0 flex-1">
                        <span className="sr-only">Search products or shops</span>
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            value={form.data.search}
                            onChange={(event) => form.setData('search', event.target.value)}
                            placeholder="Search products or shops..."
                            className="h-11 w-full rounded-xl border-0 bg-transparent pl-10 pr-3 text-sm outline-none focus:ring-0"
                        />
                    </label>
                    <button className="rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700">Search</button>
                </form>

                <div className="mt-7 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Shop products</h2>
                    <p className="text-sm text-slate-500">{products.total} products</p>
                </div>
                {products.data.length > 0 ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {products.data.map((listing) => {
                            const image = listing.thumbnail ?? listing.product.thumbnail;
                            return (
                                <Link
                                    key={listing.id}
                                    href={route('storefront.product', [listing.shop.slug, listing.product.slug])}
                                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                                >
                                    <div className="aspect-[4/3] overflow-hidden bg-slate-50">
                                        <img src={image ? `/storage/${image}` : '/images/product-placeholder.svg'} onError={(event) => { event.currentTarget.src = '/images/product-placeholder.svg'; }} alt={listing.product.name} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
                                    </div>
                                    <div className="p-4">
                                        <p className="text-xs font-semibold text-emerald-700">{listing.shop.name}</p>
                                        <h3 className="mt-1 line-clamp-1 font-bold">{listing.product.name}</h3>
                                        <p className="mt-1.5 min-h-10 line-clamp-2 text-sm text-slate-500">{listing.description ?? listing.product.description ?? 'Discover this product in store.'}</p>
                                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                            <span className="text-lg font-extrabold text-emerald-700">{listing.price}</span>
                                            <ArrowUpRight className="size-4 text-slate-400 transition group-hover:text-emerald-700" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center">
                        <ShoppingBag className="mx-auto size-9 text-slate-400" />
                        <h3 className="mt-3 font-bold">{filters.search ? 'No matching products found' : 'No products are available yet'}</h3>
                        <p className="mt-1 text-sm text-slate-500">Try another search or come back soon.</p>
                    </div>
                )}
                <div className="mt-7"><CommercePagination links={products.links} /></div>
            </div>
        </main>
    );
}
