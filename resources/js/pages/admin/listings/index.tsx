import { CommercePage, CommercePagination } from '@/components/commerce';
import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types/models';
import { Link, router } from '@inertiajs/react';

type Listing = { id: number; price: string; is_active: boolean; shop: { name: string; slug: string }; product: { name: string; slug: string; is_active: boolean } };

export default function ListingsIndex({ listings, shops, filters }: {
    listings: Paginated<Listing>;
    shops: { id: number; name: string }[];
    filters: { shop?: string };
}) {
    return (
        <CommercePage title="Monitor shop listings">
            <form className="flex flex-wrap items-end gap-3" onSubmit={(event) => {
                event.preventDefault();
                const shop = new FormData(event.currentTarget).get('shop')?.toString() ?? '';
                router.get(route('admin.listings.index'), shop ? { shop } : {}, { preserveState: true });
            }}>
                <label className="grid gap-1 text-sm">Filter by shop
                    <select name="shop" defaultValue={filters.shop ?? ''} className="rounded-md border bg-background px-3 py-2">
                        <option value="">All shops</option>{shops.map((shop) => <option key={shop.id} value={shop.id}>{shop.name}</option>)}
                    </select>
                </label><Button type="submit" variant="outline">Filter</Button>
            </form>
            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted"><tr><th className="p-3">Shop</th><th className="p-3">Catalog product</th><th className="p-3">Price</th><th className="p-3">Listing</th><th className="p-3">Catalog</th><th className="p-3">Actions</th></tr></thead>
                    <tbody>{listings.data.map((listing) => (
                        <tr className="border-t" key={listing.id}>
                            <td className="p-3">{listing.shop.name}</td><td className="p-3">{listing.product.name}</td><td className="p-3">{listing.price}</td>
                            <td className="p-3">{listing.is_active ? 'Active' : 'Inactive'}</td><td className="p-3">{listing.product.is_active ? 'Active' : 'Inactive'}</td>
                            <td className="p-3"><Link as="button" method="patch" href={route('admin.listings.toggle', listing.id)}>
                                <Button type="button" size="sm" variant="outline">{listing.is_active ? 'Deactivate' : 'Activate'} listing</Button>
                            </Link></td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
            <CommercePagination links={listings.links} />
        </CommercePage>
    );
}
