import { CommercePage } from '@/components/commerce';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, Eye, Package, Plus, ShoppingBag, Store } from 'lucide-react';
import type { ReactNode } from 'react';

type ProductListing = {
    id: number;
    price: string;
    is_active: boolean;
    product: { name: string; thumbnail: string | null; is_active: boolean };
};

type Props = {
    shop: { id: number; name: string; slug: string; status: string } | null;
    stats: { products: number; activeListings: number; pendingOrders: number } | null;
    recentProducts: ProductListing[] | null;
};

export default function OwnerDashboard({ shop, stats, recentProducts }: Props) {
    return (
        <CommercePage title="Shop dashboard">
            {!shop ? (
                <section className="rounded-2xl border bg-card p-8">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Store className="size-6" />
                    </div>
                    <h2 className="mt-5 text-xl font-semibold">Your shop is almost ready</h2>
                    <p className="mt-2 max-w-xl text-muted-foreground">
                        An administrator needs to assign a shop to your account. Once it’s set up, you’ll be able to add products and manage your storefront here.
                    </p>
                </section>
            ) : (
                <div className="space-y-8">
                    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/75 p-7 text-primary-foreground shadow-lg sm:p-9">
                        <div className="pointer-events-none absolute -right-10 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
                        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                                    <span className={`size-2 rounded-full ${shop.status === 'active' ? 'bg-emerald-300' : 'bg-amber-300'}`} />
                                    Shop {shop.status}
                                </span>
                                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{shop.name}</h2>
                                <p className="mt-2 max-w-xl text-sm text-white/80">
                                    Manage your products, prices, and storefront from one place.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button asChild variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
                                    <Link href={route('owner.orders.index')}><ShoppingBag className="mr-2 size-4" /> Orders</Link>
                                </Button>
                                <Button asChild className="bg-white text-primary hover:bg-white/90">
                                    <Link href={route('owner.products.create')}><Plus className="mr-2 size-4" /> Add product</Link>
                                </Button>
                                {shop.status === 'active' && (
                                    <Button asChild variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
                                        <a href={route('storefront.shop', shop.slug)} target="_blank" rel="noreferrer">
                                            <Eye className="mr-2 size-4" /> View storefront
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard
                            label="Your shop's products"
                            value={stats?.products ?? 0}
                            detail="Products managed in your shop"
                            icon={<Package className="size-5" />}
                            accent="blue"
                        />
                        <StatCard
                            label="Published products"
                            value={stats?.activeListings ?? 0}
                            detail="Visible to customers right now"
                            icon={<Eye className="size-5" />}
                            accent="green"
                        />
                        <StatCard
                            label="New orders"
                            value={stats?.pendingOrders ?? 0}
                            detail="Waiting for your confirmation"
                            icon={<ShoppingBag className="size-5" />}
                            accent="blue"
                        />
                    </section>

                    <section className="overflow-hidden rounded-2xl border bg-card">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5 sm:px-6">
                            <div>
                                <h2 className="font-semibold">Your products</h2>
                                <p className="mt-1 text-sm text-muted-foreground">Recently added to your store</p>
                            </div>
                            <Button asChild variant="outline" size="sm">
                                <Link href={route('owner.listings.index')}>Manage products <ArrowUpRight className="ml-2 size-4" /></Link>
                            </Button>
                        </div>
                        {recentProducts && recentProducts.length > 0 ? (
                            <div className="divide-y">
                                {recentProducts.map((listing) => (
                                    <div key={listing.id} className="flex items-center gap-4 px-5 py-4 sm:px-6">
                                        <img src={listing.product.thumbnail ? `/storage/${listing.product.thumbnail}` : '/images/product-placeholder.svg'} onError={(event) => { event.currentTarget.src = '/images/product-placeholder.svg'; }} alt="" className="size-12 rounded-lg border object-cover" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{listing.product.name}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">{listing.price}</p>
                                        </div>
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${listing.is_active && listing.product.is_active ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                                            {listing.is_active && listing.product.is_active ? 'Published' : 'Hidden'}
                                        </span>
                                        <Button asChild size="sm" variant="ghost">
                                            <Link href={route('owner.listings.edit', listing.id)}>Edit</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-12 text-center">
                                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                    <Package className="size-6" />
                                </div>
                                <h3 className="mt-4 font-medium">Your product list is empty</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Add your first product to start building your shop.</p>
                                <Button asChild className="mt-5"><Link href={route('owner.products.create')}><Plus className="mr-2 size-4" /> Add your first product</Link></Button>
                            </div>
                        )}
                    </section>
                </div>
            )}
        </CommercePage>
    );
}

function StatCard({ label, value, detail, icon, accent }: {
    label: string;
    value: number;
    detail: string;
    icon: ReactNode;
    accent: 'blue' | 'green';
}) {
    const style = accent === 'blue'
        ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';

    return (
        <article className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
                </div>
                <div className={`flex size-11 items-center justify-center rounded-xl ${style}`}>{icon}</div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{detail}</p>
        </article>
    );
}
