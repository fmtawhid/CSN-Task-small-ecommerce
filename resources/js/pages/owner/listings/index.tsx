import { CommercePage, CommercePagination } from '@/components/commerce';
import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types/models';
import { Link } from '@inertiajs/react';

type Listing = {
    id: number; price: string; description: string | null; thumbnail: string | null; is_active: boolean;
    product: { name: string; thumbnail: string | null; is_active: boolean };
};

export default function OwnerListings({ listings }: { listings: Paginated<Listing> }) {
    return (
        <CommercePage title="My products">
            <div className="flex flex-wrap justify-end gap-2">
                <Button asChild variant="outline"><Link href={route('owner.catalog.index')}>Browse shared catalog</Link></Button>
                <Button asChild><Link href={route('owner.products.create')}>Create new product</Link></Button>
            </div>
            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted"><tr><th className="p-3">Product</th><th className="p-3">Price</th><th className="p-3">Listing status</th><th className="p-3">Product status</th><th className="p-3">Actions</th></tr></thead>
                    <tbody>{listings.data.map((listing) => (
                        <tr className="border-t" key={listing.id}>
                            <td className="p-3">{listing.product.name}</td><td className="p-3">{listing.price}</td>
                            <td className="p-3">{listing.is_active ? 'Active' : 'Inactive'}</td><td className="p-3">{listing.product.is_active ? 'Active' : 'Inactive'}</td>
                            <td className="space-x-2 p-3">
                                <Button asChild size="sm" variant="outline"><Link href={route('owner.listings.edit', listing.id)}>Edit</Link></Button>
                                <Link as="button" method="delete" href={route('owner.listings.destroy', listing.id)} onBefore={() => confirm('Remove this product from your shop? The shared catalog product will remain.')}>
                                    <Button type="button" size="sm" variant="destructive">Remove listing</Button>
                                </Link>
                            </td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
            <CommercePagination links={listings.links} />
        </CommercePage>
    );
}
