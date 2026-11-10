import MarketplaceNav from '@/components/marketplace-nav';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, PackageCheck } from 'lucide-react';

type CheckoutOrder = { order_number: string; shop_name: string; subtotal: string };

export default function OrderConfirmation({ orders }: { orders: CheckoutOrder[] }) {
    return (
        <main className="min-h-screen bg-white text-slate-900">
            <Head title="Order placed" />
            <MarketplaceNav />
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
                <section className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6 text-center sm:p-10">
                    <CheckCircle2 className="mx-auto size-14 text-emerald-600" />
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Thank you</p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Your order is on its way</h1>
                    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">Your order details have been sent to the shop owner. Pay by cash when your order is delivered.</p>
                </section>
                <div className="mt-6 space-y-3">
                    {orders.map((order) => (
                        <article key={order.order_number} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 p-5">
                            <div className="flex items-start gap-3">
                                <PackageCheck className="mt-0.5 size-5 text-emerald-600" />
                                <div>
                                    <p className="font-bold">{order.shop_name}</p>
                                    <p className="mt-1 text-sm text-slate-500">Order {order.order_number}</p>
                                </div>
                            </div>
                            <p className="font-bold">{order.subtotal}</p>
                        </article>
                    ))}
                </div>
                <Link href={route('storefront.products.index')} className="mt-7 inline-flex w-full justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700 sm:w-auto">Continue shopping</Link>
            </div>
        </main>
    );
}
