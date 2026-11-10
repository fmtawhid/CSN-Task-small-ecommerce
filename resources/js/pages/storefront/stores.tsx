import { CommercePagination } from '@/components/commerce';
import MarketplaceNav from '@/components/marketplace-nav';
import { Head, Link, router, useForm } from '@inertiajs/react';
import type { Paginated } from '@/types/models';
import { Search, Store } from 'lucide-react';
import type { FormEvent } from 'react';

type Shop = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    published_products_count: number;
};

export default function StoresIndex({ shops, filters }: {
    shops: Paginated<Shop>;
    filters: { search?: string };
}) {
    const form = useForm({ search: filters.search ?? '' });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get(route('storefront.stores.index'), { search: form.data.search }, { preserveState: true, replace: true });
    };

    return (
        <main className="min-h-screen bg-white text-slate-900">
            <Head title="All shops" />
            <MarketplaceNav />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <header className="flex flex-wrap items-end justify-between gap-5">
                    <div>
                        <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Meet the sellers</p>
                        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">All shops</h1>
                        <p className="mt-2 text-sm text-slate-500">Explore independent stores and their published products.</p>
                    </div>
                    <Link href={route('storefront.products.index')} className="text-sm font-bold text-emerald-700 hover:text-emerald-800">Browse all products <span aria-hidden="true">→</span></Link>
                </header>

                <form onSubmit={submit} role="search" className="mt-7 flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
                    <label className="relative min-w-0 flex-1">
                        <span className="sr-only">Search shops</span>
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            value={form.data.search}
                            onChange={(event) => form.setData('search', event.target.value)}
                            placeholder="Search shop name or description..."
                            className="h-11 w-full rounded-xl border-0 bg-transparent pl-10 pr-3 text-sm outline-none focus:ring-0"
                        />
                    </label>
                    <button className="rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700">Search</button>
                </form>

                <div className="mt-7 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Marketplace shops</h2>
                    <p className="text-sm text-slate-500">{shops.total} shops</p>
                </div>
                {shops.data.length > 0 ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {shops.data.map((shop) => (
                            <Link key={shop.id} href={route('storefront.shop', shop.slug)} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
                                {shop.logo ? (
                                    <img src={`/storage/${shop.logo}`} alt={`${shop.name} logo`} className="size-16 shrink-0 rounded-2xl object-cover" />
                                ) : (
                                    <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Store className="size-7" /></span>
                                )}
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate font-bold group-hover:text-emerald-700">{shop.name}</span>
                                    <span className="mt-1 block line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{shop.description || 'Explore products from this independent shop.'}</span>
                                    <span className="mt-2 block text-xs font-semibold text-emerald-700">{shop.published_products_count} published {shop.published_products_count === 1 ? 'product' : 'products'}</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center">
                        <Store className="mx-auto size-9 text-slate-400" />
                        <h3 className="mt-3 font-bold">{filters.search ? 'No matching shops found' : 'No shops are open yet'}</h3>
                        <p className="mt-1 text-sm text-slate-500">Try another search or check back later.</p>
                    </div>
                )}
                <div className="mt-7"><CommercePagination links={shops.links} /></div>
            </div>
        </main>
    );
}
