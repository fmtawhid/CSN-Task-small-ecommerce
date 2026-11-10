import { CommercePage, CommercePagination } from '@/components/commerce';
import { router } from '@inertiajs/react';
import { PackageCheck, ShoppingBag } from 'lucide-react';

type OrderItem = {
    id: number;
    product_name: string;
    unit_price: string;
    quantity: number;
    line_total: string;
};

type ShopOrder = {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string | null;
    delivery_address: string;
    customer_notes: string | null;
    payment_method: string;
    status: string;
    subtotal: string;
    created_at: string;
    available_statuses: string[];
    items: OrderItem[];
};

export default function OwnerOrders({ orders }: {
    orders: { data: ShopOrder[]; links: { url: string | null; label: string; active: boolean }[] };
}) {
    return (
        <CommercePage title="Shop orders">
            {orders.data.length === 0 ? (
                <section className="rounded-2xl border bg-card px-6 py-14 text-center">
                    <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
                    <h2 className="mt-4 font-semibold">No orders yet</h2>
                    <p className="mt-2 text-sm text-muted-foreground">New customer orders for your shop will appear here.</p>
                </section>
            ) : (
                <div className="space-y-4">
                    {orders.data.map((order) => (
                        <article key={order.id} className="overflow-hidden rounded-2xl border bg-card">
                            <header className="flex flex-wrap items-start justify-between gap-4 border-b p-5">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="font-bold">{order.order_number}</h2>
                                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold capitalize text-primary">{order.status}</span>
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                                </div>
                                {order.available_statuses.length > 0 && (
                                    <label className="flex items-center gap-2 text-sm font-medium">
                                        Update status
                                        <select defaultValue="" onChange={(event) => {
                                            const status = event.target.value;
                                            if (!status) return;
                                            router.patch(route('owner.orders.update', order.id), { status }, { preserveScroll: true });
                                            event.target.value = '';
                                        }} className="rounded-lg border bg-background px-3 py-2 capitalize">
                                            <option value="" disabled>Select...</option>
                                            {order.available_statuses.map((status) => <option key={status} value={status} className="capitalize">{status}</option>)}
                                        </select>
                                    </label>
                                )}
                            </header>
                            <div className="grid gap-6 p-5 md:grid-cols-[1fr_280px]">
                                <section>
                                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><PackageCheck className="size-4" /> Items</h3>
                                    <div className="divide-y rounded-xl border">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between gap-4 p-3 text-sm">
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium">{item.product_name}</p>
                                                    <p className="mt-1 text-muted-foreground">{item.quantity} × {item.unit_price}</p>
                                                </div>
                                                <p className="shrink-0 font-semibold">{item.line_total}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 flex justify-between text-sm font-bold"><span>Cash on delivery total</span><span>{order.subtotal}</span></div>
                                </section>
                                <section className="space-y-3 text-sm">
                                    <div><h3 className="font-semibold">Customer</h3><p className="mt-1">{order.customer_name}</p><p className="text-muted-foreground">{order.customer_phone}</p>{order.customer_email && <p className="text-muted-foreground">{order.customer_email}</p>}</div>
                                    <div><h3 className="font-semibold">Delivery address</h3><p className="mt-1 whitespace-pre-line text-muted-foreground">{order.delivery_address}</p></div>
                                    {order.customer_notes && <div><h3 className="font-semibold">Customer notes</h3><p className="mt-1 whitespace-pre-line text-muted-foreground">{order.customer_notes}</p></div>}
                                </section>
                            </div>
                        </article>
                    ))}
                    <CommercePagination links={orders.links} />
                </div>
            )}
        </CommercePage>
    );
}
