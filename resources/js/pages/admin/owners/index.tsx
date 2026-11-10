import { CommercePage, CommercePagination } from '@/components/commerce';
import { Button } from '@/components/ui/button';
import type { Paginated, User } from '@/types/models';
import { Link } from '@inertiajs/react';

type Owner = User & { shop: { id: number; name: string; status: string } | null };

export default function OwnersIndex({ owners }: { owners: Paginated<Owner> }) {
    return (
        <CommercePage title="Shop owners">
            <div className="flex justify-end">
                <Button asChild><Link href={route('admin.owners.create')}>Create shop owner</Link></Button>
            </div>
            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted"><tr><th className="p-3">Owner</th><th className="p-3">Email</th><th className="p-3">Shop</th><th className="p-3">Actions</th></tr></thead>
                    <tbody>{owners.data.map((owner) => (
                        <tr className="border-t" key={owner.id}>
                            <td className="p-3">{owner.name}</td><td className="p-3">{owner.email}</td>
                            <td className="p-3">{owner.shop?.name ?? 'No shop assigned'}</td>
                            <td className="space-x-2 p-3">
                                <Button asChild size="sm" variant="outline"><Link href={route('admin.owners.edit', owner.id)}>Edit</Link></Button>
                                <Link as="button" method="delete" href={route('admin.owners.destroy', owner.id)} onBefore={() => confirm('Delete this account?')}>
                                    <Button size="sm" variant="destructive" type="button" disabled={Boolean(owner.shop)}>Delete</Button>
                                </Link>
                            </td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
            <CommercePagination links={owners.links} />
        </CommercePage>
    );
}
