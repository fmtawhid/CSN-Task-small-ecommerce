import { Link, router } from '@inertiajs/react';
import { Search, ShoppingBag, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { readShoppingCart, shoppingCartCount, subscribeToShoppingCart } from '@/lib/shopping-cart';

export default function MarketplaceNav() {
    const [search, setSearch] = useState('');
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const updateCount = () => setCartCount(shoppingCartCount(readShoppingCart()));
        updateCount();
        return subscribeToShoppingCart(updateCount);
    }, []);

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        router.get(route('storefront.products.index'), { search }, { preserveState: true });
    };

    return (
        <>
            <div className="border-b border-slate-100 bg-slate-50 text-xs text-slate-600">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
                    <span className="flex items-center gap-2"><Store className="size-3.5 text-emerald-600" /> Discover independent shops and their products</span>
                    <Link href={route('storefront.stores.index')} className="font-semibold text-slate-700 hover:text-emerald-700">Meet the shops <span aria-hidden="true">→</span></Link>
                </div>
            </div>

            <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:gap-8 lg:px-8">
                    <Link href="/" className="flex shrink-0 items-center gap-2">
                        <img src="/images/logo.png" alt="Marketplace logo" className="size-9 rounded-lg object-contain sm:size-10" />
                        <span className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">Marketplace</span>
                    </Link>

                    <form className="hidden min-w-0 flex-1 md:block" onSubmit={submitSearch} role="search">
                        <label className="relative block">
                            <span className="sr-only">Search products</span>
                            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products or shops..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
                        </label>
                    </form>

                    <nav className="ml-auto flex shrink-0 items-center gap-0 sm:gap-1 lg:gap-2">
                        <Link href={route('storefront.products.index')} className="hidden rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 sm:inline-flex lg:px-3">Products</Link>
                        <Link href={route('storefront.stores.index')} className="hidden rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 sm:inline-flex lg:px-3">Stores</Link>
                        <Link href={route('storefront.cart.index')} className="relative flex size-9 items-center justify-center rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-700" aria-label={`Cart${cartCount ? `, ${cartCount} items` : ''}`}>
                            <ShoppingBag className="size-5" />
                            {cartCount > 0 && <span className="absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold leading-4 text-white">{cartCount > 99 ? '99+' : cartCount}</span>}
                        </Link>
                        <Link href={route('login')} className="rounded-lg px-1.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 sm:px-2 lg:px-3">Sign in</Link>
                        <Link href={route('register')} className="rounded-lg bg-emerald-600 px-2 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:px-3 lg:px-4">
                            <span className="sm:hidden">Join</span><span className="hidden sm:inline">Join Marketplace</span>
                        </Link>
                    </nav>
                </div>

                <div className="border-t border-slate-100 px-4 py-2.5 md:hidden">
                    <nav className="mx-auto mb-2 flex max-w-7xl gap-2 text-xs font-semibold">
                        <Link href={route('storefront.products.index')} className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800">All products</Link>
                        <Link href={route('storefront.stores.index')} className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700">All stores</Link>
                    </nav>
                    <form onSubmit={submitSearch} role="search" className="mx-auto flex max-w-7xl gap-2">
                        <label className="relative min-w-0 flex-1">
                            <span className="sr-only">Search products</span>
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products or shops..." className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
                        </label>
                        <button aria-label="Search" className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white"><Search className="size-4" /></button>
                    </form>
                </div>
            </header>
        </>
    );
}
