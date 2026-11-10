import { CommercePagination } from '@/components/commerce';
import MarketplaceNav from '@/components/marketplace-nav';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, CalendarDays, Package, ShoppingBag, Sparkles, Store } from 'lucide-react';

type Listing = {
    id: number;
    price: string;
    description: string | null;
    thumbnail: string | null;
    product: { name: string; slug: string; description: string | null; thumbnail: string | null };
};

type Shop = {
    name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    owner_name: string;
    published_products_count: number;
    member_since: string | null;
};

export default function StorefrontShop({ shop, listings }: {
    shop: Shop;
    listings: { data: Listing[]; links: { url: string | null; label: string; active: boolean }[]; total: number };
}) {
    return (
        <main className="min-h-screen bg-white text-foreground">
            <Head title={shop.name} />
            <MarketplaceNav />
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end">
                    <Link href={route('storefront.stores.index')} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
                        <ArrowLeft className="size-4" /> All shops
                    </Link>
                </div>

                <header className="relative mt-5 overflow-hidden rounded-3xl border bg-card shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-500/10" />
                    <div className="absolute -right-20 -top-32 size-96 rounded-full bg-primary/5 blur-3xl" />
                    <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                            <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border bg-background shadow-sm sm:size-36">
                                {shop.logo ? (
                                    <img src={`/storage/${shop.logo}`} alt={`${shop.name} logo`} className="size-full object-cover" />
                                ) : (
                                    <Store className="size-12 text-primary/70" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1 text-xs font-semibold text-primary">
                                    <Sparkles className="size-3.5" /> Independent store
                                </span>
                                <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{shop.name}</h1>
                                <p className="mt-2 max-w-2xl whitespace-pre-line text-sm leading-6 text-muted-foreground sm:text-base">
                                    {shop.description || 'A thoughtfully curated collection, available directly from this shop.'}
                                </p>
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Store by <span className="font-semibold text-foreground">{shop.owner_name}</span>
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 lg:min-w-64 lg:grid-cols-1">
                            <div className="rounded-2xl border bg-background/80 p-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Package className="size-4 text-primary" /> Available products
                                </div>
                                <p className="mt-2 text-3xl font-bold">{shop.published_products_count}</p>
                                <p className="mt-1 text-xs text-muted-foreground">Published in this shop</p>
                            </div>
                            {shop.member_since && (
                                <div className="rounded-2xl border bg-background/80 p-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CalendarDays className="size-4 text-primary" /> Store since
                                    </div>
                                    <p className="mt-2 text-lg font-bold">{shop.member_since}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">Part of our marketplace</p>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <section className="mt-10">
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-primary">Explore the collection</p>
                            <h2 className="mt-1 text-2xl font-bold tracking-tight">Shop products</h2>
                        </div>
                        <span className="rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground">
                            {listings.total} {listings.total === 1 ? 'product' : 'products'}
                        </span>
                    </div>

                    {listings.data.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {listings.data.map((listing) => {
                                const image = listing.thumbnail ?? listing.product.thumbnail;
                                const description = listing.description ?? listing.product.description;

                                return (
                                    <Link
                                        className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                                        key={listing.id}
                                        href={route('storefront.product', [shop.slug, listing.product.slug])}
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                            <img
                                                className="size-full object-cover transition duration-500 group-hover:scale-105"
                                                src={image ? `/storage/${image}` : '/images/product-placeholder.svg'}
                                                onError={(event) => { event.currentTarget.src = '/images/product-placeholder.svg'; }}
                                                alt={listing.product.name}
                                                loading="lazy"
                                            />
                                            <span className="absolute left-3 top-3 rounded-full border bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
                                                In this store
                                            </span>
                                            <span className="absolute bottom-3 right-3 rounded-full bg-background px-3 py-1.5 text-sm font-bold shadow">
                                                {listing.price}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="line-clamp-1 font-semibold">{listing.product.name}</h3>
                                            <p className="mt-2 min-h-10 line-clamp-2 text-sm leading-5 text-muted-foreground">
                                                {description || 'Discover more details about this product.'}
                                            </p>
                                            <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm">
                                                <span className="font-semibold text-primary">View details</span>
                                                <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
                            <ShoppingBag className="mx-auto size-10 text-muted-foreground/50" />
                            <h3 className="mt-4 font-semibold">This shop is getting ready</h3>
                            <p className="mt-1 text-sm text-muted-foreground">There are no published products to show right now.</p>
                        </div>
                    )}
                    <div className="mt-7"><CommercePagination links={listings.links} /></div>
                </section>
            </div>
        </main>
    );
}
