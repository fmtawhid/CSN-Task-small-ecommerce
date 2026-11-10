import MarketplaceNav from '@/components/marketplace-nav';
import { readShoppingCart, shoppingCartCount, writeShoppingCart } from '@/lib/shopping-cart';
import type { ShoppingCartItem } from '@/lib/shopping-cart';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

type CheckoutForm = {
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    delivery_address: string;
    customer_notes: string;
    items: { listing_id: number; quantity: number }[];
};

export default function CartPage() {
    const [cart, setCart] = useState<ShoppingCartItem[]>([]);
    const form = useForm<CheckoutForm>({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        delivery_address: '',
        customer_notes: '',
        items: [],
    });

    useEffect(() => setCart(readShoppingCart()), []);

    const updateCart = (items: ShoppingCartItem[]) => {
        setCart(items);
        writeShoppingCart(items);
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            items: cart.map((item) => ({ listing_id: item.listingId, quantity: item.quantity })),
        }));
        form.post(route('storefront.orders.store'), {
            preserveScroll: true,
            onSuccess: () => {
                writeShoppingCart([]);
                setCart([]);
            },
        });
    };

    const subtotal = cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

    return (
        <main className="min-h-screen bg-white text-slate-900">
            <Head title="Your cart" />
            <MarketplaceNav />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Link href={route('storefront.products.index')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700">
                    <ArrowLeft className="size-4" /> Continue shopping
                </Link>
                <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Checkout</p>
                    <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Your cart</h1>
                    <p className="mt-2 text-sm text-slate-500">{shoppingCartCount(cart)} items from independent shops</p>
                </div>

                {cart.length === 0 ? (
                    <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
                        <ShoppingBag className="mx-auto size-10 text-slate-400" />
                        <h2 className="mt-4 text-lg font-bold">Your cart is empty</h2>
                        <p className="mt-2 text-sm text-slate-500">Browse the marketplace and add something you love.</p>
                        <Link href={route('storefront.products.index')} className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700">Browse products</Link>
                    </section>
                ) : (
                    <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <article key={item.listingId} className="flex gap-4 rounded-2xl border border-slate-200 p-4 sm:p-5">
                                    <Link href={route('storefront.product', { shop: item.shopSlug, product: item.productSlug })} className="size-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:size-28">
                                        <img src={item.thumbnail ? `/storage/${item.thumbnail}` : '/images/product-placeholder.svg'} onError={(event) => { event.currentTarget.src = '/images/product-placeholder.svg'; }} alt="" className="size-full object-cover" />
                                    </Link>
                                    <div className="min-w-0 flex-1">
                                        <Link href={route('storefront.product', { shop: item.shopSlug, product: item.productSlug })} className="font-bold hover:text-emerald-700">{item.productName}</Link>
                                        <Link href={route('storefront.shop', item.shopSlug)} className="mt-1 block text-sm text-slate-500 hover:text-emerald-700">{item.shopName}</Link>
                                        <p className="mt-2 text-sm font-semibold text-emerald-700">{item.price}</p>
                                        <div className="mt-3 flex items-center gap-2">
                                            <div className="inline-flex h-9 items-center rounded-lg border border-slate-200">
                                                <button type="button" aria-label={`Decrease ${item.productName} quantity`} onClick={() => updateCart(cart.map((line) => line.listingId === item.listingId ? { ...line, quantity: Math.max(1, line.quantity - 1) } : line))} className="flex size-8 items-center justify-center text-slate-600 hover:text-emerald-700"><Minus className="size-3.5" /></button>
                                                <span className="min-w-7 text-center text-sm font-semibold">{item.quantity}</span>
                                                <button type="button" aria-label={`Increase ${item.productName} quantity`} onClick={() => updateCart(cart.map((line) => line.listingId === item.listingId ? { ...line, quantity: Math.min(50, line.quantity + 1) } : line))} className="flex size-8 items-center justify-center text-slate-600 hover:text-emerald-700"><Plus className="size-3.5" /></button>
                                            </div>
                                            <button type="button" onClick={() => updateCart(cart.filter((line) => line.listingId !== item.listingId))} className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-slate-500 hover:bg-red-50 hover:text-red-700"><Trash2 className="size-3.5" /> Remove</button>
                                        </div>
                                    </div>
                                    <p className="hidden shrink-0 font-bold sm:block">{(Number(item.price) * item.quantity).toFixed(2)}</p>
                                </article>
                            ))}
                        </div>

                        <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 p-5 sm:p-6">
                            <div>
                                <h2 className="text-lg font-bold">Delivery details</h2>
                                <p className="mt-1 text-sm text-slate-500">Each shop receives its own order. Pay when it arrives.</p>
                            </div>
                            <label className="grid gap-1.5 text-sm font-semibold">Full name
                                <input value={form.data.customer_name} onChange={(event) => form.setData('customer_name', event.target.value)} required autoComplete="name" className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-emerald-500" />
                                {form.errors.customer_name && <span className="text-xs text-red-600">{form.errors.customer_name}</span>}
                            </label>
                            <label className="grid gap-1.5 text-sm font-semibold">Phone number
                                <input value={form.data.customer_phone} onChange={(event) => form.setData('customer_phone', event.target.value)} required autoComplete="tel" className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-emerald-500" />
                                {form.errors.customer_phone && <span className="text-xs text-red-600">{form.errors.customer_phone}</span>}
                            </label>
                            <label className="grid gap-1.5 text-sm font-semibold">Email <span className="font-normal text-slate-400">(optional)</span>
                                <input type="email" value={form.data.customer_email} onChange={(event) => form.setData('customer_email', event.target.value)} autoComplete="email" className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-emerald-500" />
                                {form.errors.customer_email && <span className="text-xs text-red-600">{form.errors.customer_email}</span>}
                            </label>
                            <label className="grid gap-1.5 text-sm font-semibold">Delivery address
                                <textarea value={form.data.delivery_address} onChange={(event) => form.setData('delivery_address', event.target.value)} required rows={3} autoComplete="street-address" className="resize-y rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-emerald-500" />
                                {form.errors.delivery_address && <span className="text-xs text-red-600">{form.errors.delivery_address}</span>}
                            </label>
                            <label className="grid gap-1.5 text-sm font-semibold">Notes <span className="font-normal text-slate-400">(optional)</span>
                                <textarea value={form.data.customer_notes} onChange={(event) => form.setData('customer_notes', event.target.value)} rows={2} className="resize-y rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-emerald-500" />
                            </label>
                            {form.errors.items && <p className="text-sm text-red-600">{form.errors.items}</p>}
                            <div className="border-t border-slate-100 pt-4">
                                <div className="flex justify-between text-sm text-slate-600"><span>Estimated subtotal</span><span>{subtotal.toFixed(2)}</span></div>
                                <p className="mt-1 text-xs text-slate-400">Final prices are verified when your order is placed.</p>
                                <button type="submit" disabled={form.processing || cart.length === 0} className="mt-4 flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                                    {form.processing ? 'Placing order...' : 'Place cash-on-delivery order'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}
