import { Store, Search, ShieldCheck } from 'lucide-react';

const features = [
    { title: 'Independent shops', description: 'Browse distinct storefronts run by individual shop owners.', icon: Store },
    { title: 'Easy discovery', description: 'Explore a shared catalog and find products across the marketplace.', icon: Search },
    { title: 'Shop-specific details', description: 'Each shop controls its own listing, price, and product presentation.', icon: ShieldCheck },
];

export default function AboutSection() {
    return (
        <section className="mx-auto max-w-7xl px-5 py-16">
            <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-semibold text-primary">About the marketplace</p>
                <h2 className="mt-2 text-3xl font-bold">A better way to discover shops</h2>
                <p className="mt-4 text-muted-foreground">
                    Shop from a shared product catalog while every seller keeps control of their own storefront.
                </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
                {features.map(({ title, description, icon: Icon }) => (
                    <article key={title} className="rounded-xl border bg-card p-6">
                        <Icon className="size-7 text-primary" />
                        <h3 className="mt-4 font-semibold">{title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
