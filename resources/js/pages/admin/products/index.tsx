import { CommercePage, CommercePagination } from '@/components/commerce';
import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types/models';
import { Link } from '@inertiajs/react';

type Product = { id: number; name: string; slug: string; is_active: boolean; listings_count: number; creator: { name: string } };

export default function ProductsIndex({ products }: { products: Paginated<Product> }) {
    return (
        <CommercePage title="Global product catalog">
            <div className="flex justify-end"><Button asChild><Link href={route('admin.products.create')}>Create product</Link></Button></div>
            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted"><tr><th className="p-3">Product</th><th className="p-3">Created by</th><th className="p-3">Shop listings</th><th className="p-3">Catalog status</th><th className="p-3">Actions</th></tr></thead>
                    <tbody>{products.data.map((product) => (
                        <tr className="border-t" key={product.id}>
                            <td className="p-3">{product.name}</td><td className="p-3">{product.creator.name}</td><td className="p-3">{product.listings_count}</td><td className="p-3">{product.is_active ? 'Active' : 'Inactive'}</td>
                            <td className="space-x-2 p-3">
                                <Button asChild size="sm" variant="outline"><Link href={route('admin.products.edit', product.id)}>Edit / status</Link></Button>
                                <Link as="button" method="delete" href={route('admin.products.destroy', product.id)} onBefore={() => confirm('Delete this global product and its shop listings?')}>
                                    <Button size="sm" variant="destructive" type="button">Delete</Button>
                                </Link>
                            </td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
            <CommercePagination links={products.links} />
        </CommercePage>
    );
}
