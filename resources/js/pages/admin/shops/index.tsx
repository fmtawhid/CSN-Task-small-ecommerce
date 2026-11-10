import { CommercePage, CommercePagination } from '@/components/commerce';
import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types/models';
import { Link } from '@inertiajs/react';

type Shop = { id: number; name: string; slug: string; status: string; listings_count: number; owner: { name: string; email: string } };

export default function ShopsIndex({ shops }: { shops: Paginated<Shop> }) {
    return (
        <CommercePage title="Shops">
            <div className="flex justify-end"><Button asChild><Link href={route('admin.shops.create')}>Create shop</Link></Button></div>
            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted"><tr><th className="p-3">Shop</th><th className="p-3">Owner</th><th className="p-3">Listings</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
                    <tbody>{shops.data.map((shop) => (
                        <tr className="border-t" key={shop.id}>
                            <td className="p-3"><a className="text-primary underline" href={route('storefront.shop', shop.slug)}>{shop.name}</a></td>
                            <td className="p-3">{shop.owner.name} · {shop.owner.email}</td><td className="p-3">{shop.listings_count}</td>
                            <td className="p-3">{shop.status}</td>
                            <td className="space-x-2 p-3">
                                <Button asChild size="sm" variant="outline"><Link href={route('admin.shops.edit', shop.id)}>Edit</Link></Button>
                                <Link as="button" method="delete" href={route('admin.shops.destroy', shop.id)} onBefore={() => confirm('Delete this shop and all its listings?')}>
                                    <Button size="sm" variant="destructive" type="button">Delete</Button>
                                </Link>
                            </td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
            <CommercePagination links={shops.links} />
        </CommercePage>
    );
}
