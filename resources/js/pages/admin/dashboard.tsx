import { CommercePage } from '@/components/commerce';

export default function AdminDashboard({ stats }: { stats: Record<string, number> }) {
    const cards = [
        ['All shops', stats.shops],
        ['Active shops', stats.activeShops],
        ['Shop owners', stats.owners],
        ['Global products', stats.products],
        ['Active products', stats.activeProducts],
        ['Shop listings', stats.listings],
    ];

    return (
        <CommercePage title="Admin dashboard">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map(([label, value]) => (
                    <section key={label} className="rounded-xl border bg-card p-6 shadow-sm">
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="mt-2 text-3xl font-semibold">{value}</p>
                    </section>
                ))}
            </div>
        </CommercePage>
    );
}
