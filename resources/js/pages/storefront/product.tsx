import MarketplaceNav from '@/components/marketplace-nav';
import { readShoppingCart, writeShoppingCart } from '@/lib/shopping-cart';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Store } from 'lucide-react';
import { useState } from 'react';

type Listing = {
    id: number;
    shop_id: number;
    price: string;
    description: string | null;
    thumbnail: string | null;
    product: { name: string; slug: string; description: string | null; thumbnail: string | null };
};

export default function StorefrontProduct({ shop, listing }: {
    shop: { id: number; name: string; slug: string };
    listing: Listing;
}) {
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const image = listing.thumbnail ?? listing.product.thumbnail;
    const description = listing.description ?? listing.product.description ?? 'Product details are coming soon.';

    const addToCart = () => {
        const cart = readShoppingCart();
        const existing = cart.find((item) => item.listingId === listing.id);
        if (existing) {
            existing.quantity = Math.min(50, existing.quantity + quantity);
            writeShoppingCart(cart);
        } else {
            writeShoppingCart([...cart, {
                listingId: listing.id,
                shopId: shop.id,
                shopSlug: shop.slug,
                shopName: shop.name,
                productSlug: listing.product.slug,
                productName: listing.product.name,
                description,
                thumbnail: image,
                price: listing.price,
                quantity,
            }]);
        }
        setAdded(true);
        window.setTimeout(() => setAdded(false), 2500);
    };

    return (
        <main className="min-h-screen bg-white text-slate-900">
            <Head title={`${listing.product.name} - ${shop.name}`} />
            <MarketplaceNav />
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <Link className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-700" href={route('storefront.shop', shop.slug)}>
                    <ArrowLeft className="size-4" /> Back to {shop.name}
                </Link>
                <article className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
                    <div className="min-h-72 bg-slate-50 md:min-h-[34rem]">
                        <img
                            className="size-full max-h-[42rem] object-cover"
                            src={image ? `/storage/${image}` : '/images/product-placeholder.svg'}
                            onError={(event) => { event.currentTarget.src = '/images/product-placeholder.svg'; }}
                            alt={listing.product.name}
                        />
                    </div>
                    <div className="flex flex-col justify-center space-y-5 p-6 sm:p-10">
                        <Link href={route('storefront.shop', shop.slug)} className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                            <Store className="size-4" /> {shop.name}
                        </Link>
                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{listing.product.name}</h1>
                        <p className="whitespace-pre-line leading-7 text-slate-600">{description}</p>
                        <p className="text-3xl font-extrabold text-emerald-700">{listing.price}</p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <div className="inline-flex h-11 items-center rounded-xl border border-slate-200">
                                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity" className="flex size-10 items-center justify-center text-slate-600 hover:text-emerald-700"><Minus className="size-4" /></button>
                                <span className="min-w-8 text-center text-sm font-bold" aria-live="polite">{quantity}</span>
                                <button type="button" onClick={() => setQuantity((value) => Math.min(50, value + 1))} aria-label="Increase quantity" className="flex size-10 items-center justify-center text-slate-600 hover:text-emerald-700"><Plus className="size-4" /></button>
                            </div>
                            <button type="button" onClick={addToCart} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700">
                                <ShoppingBag className="size-4" /> {added ? 'Added to cart' : 'Add to cart'}
                            </button>
                        </div>
                        <Link href={route('storefront.cart.index')} className="text-sm font-semibold text-emerald-700 hover:underline">Go to cart and checkout</Link>
                        <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                            <p className="font-semibold text-slate-800">Order directly from this shop</p>
                            <p>Your order request will be sent to {shop.name}. Payment is collected on delivery.</p>
                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
}
