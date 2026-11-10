import { Head, Link } from '@inertiajs/react';
import MarketplaceNav from '@/components/marketplace-nav';
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, PackageCheck, ShieldCheck, ShoppingBag, Star, Store } from 'lucide-react';
import { useEffect, useState } from 'react';

type ProductListing = {
    id: number;
    price: string;
    description: string | null;
    thumbnail: string | null;
    shop: { id: number; name: string; slug: string };
    product: { id: number; name: string; slug: string; description: string | null; thumbnail: string | null };
};

type HomepageSlide = {
    id: number;
    title: string;
    subtitle: string | null;
    image: string;
    button_text: string | null;
    button_url: string | null;
};

type Testimonial = {
    id: number;
    reviewer_name: string;
    reviewer_title: string | null;
    review: string;
    rating: number;
};

export default function Home({ slides, testimonials, products }: {
    slides: HomepageSlide[];
    testimonials: Testimonial[];
    products: ProductListing[];
}) {
    const [activeSlide, setActiveSlide] = useState(0);
    const slide = slides[activeSlide];
    const featuredProduct = products[0];
    const slideImage = slide?.image
        ? (slide.image.startsWith('/') ? slide.image : `/storage/${slide.image}`)
        : featuredProduct?.thumbnail
          ? `/storage/${featuredProduct.thumbnail}`
          : featuredProduct?.product.thumbnail
            ? `/storage/${featuredProduct.product.thumbnail}`
            : '/images/product-placeholder.svg';

    useEffect(() => {
        if (slides.length < 2) {
            return;
        }

        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, 6000);

        return () => window.clearInterval(timer);
    }, [slides.length]);

    const moveSlide = (direction: -1 | 1) => {
        setActiveSlide((current) => (current + direction + slides.length) % slides.length);
    };

    return (
        <main className="min-h-screen bg-white text-slate-900">
            <Head title="Discover independent shops" />

            <MarketplaceNav />

            <section aria-label="Featured marketplace banners" className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
                <div className="relative isolate min-h-[420px] overflow-hidden rounded-3xl bg-[#eff7f1] sm:min-h-[470px] lg:min-h-[500px]">
                    <img
                        key={slide?.id ?? 'featured-fallback'}
                        src={slideImage}
                        onError={(event) => { event.currentTarget.src = '/images/product-placeholder.svg'; }}
                        alt={slide?.title ?? 'Featured marketplace product'}
                        className="absolute inset-0 z-0 size-full object-cover"
                    />
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/95 to-white/10 sm:via-white/85" />
                    <div className="relative z-10 flex min-h-[420px] items-center px-6 py-12 sm:min-h-[470px] sm:px-10 lg:min-h-[500px] lg:px-16">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-emerald-800">
                                <span className="size-1.5 rounded-full bg-emerald-500" /> The independent shop marketplace
                            </span>
                            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                                {slide?.title ?? 'Good finds from shops worth knowing.'}
                            </h1>
                            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                                {slide?.subtitle ?? 'Explore thoughtfully picked products from independent sellers, all in one welcoming marketplace.'}
                            </p>
                            <a
                                href={slide?.button_url ?? route('storefront.products.index')}
                                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                            >
                                {slide?.button_text ?? 'Explore products'} <ArrowRight className="size-4" />
                            </a>
                            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-600">
                                <span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-emerald-600" /> Independent sellers</span>
                                <span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-emerald-600" /> Shop-specific prices</span>
                            </div>
                        </div>
                    </div>
                    {slides.length > 1 && (
                        <>
                            <button onClick={() => moveSlide(-1)} aria-label="Previous banner" className="absolute right-16 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white/90 text-slate-700 shadow transition hover:bg-white">
                                <ChevronLeft className="size-5" />
                            </button>
                            <button onClick={() => moveSlide(1)} aria-label="Next banner" className="absolute right-4 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white/90 text-slate-700 shadow transition hover:bg-white">
                                <ChevronRight className="size-5" />
                            </button>
                            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                                {slides.map((item, index) => (
                                    <button
                                        key={item.id}
                                        aria-label={`Show banner ${index + 1}`}
                                        onClick={() => setActiveSlide(index)}
                                        className={`h-2 rounded-full transition-all ${activeSlide === index ? 'w-7 bg-emerald-700' : 'w-2 bg-slate-400/70 hover:bg-slate-500'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">
                <Feature icon={Store} title="Independent shops" description="Meet the people and stores behind each collection." />
                <Feature icon={ShieldCheck} title="Details that matter" description="Every shop controls its own product details and prices." />
                <Feature icon={PackageCheck} title="Easy discovery" description="Explore products and visit each shop directly." />
            </section>

            <section id="products" className="scroll-mt-28 border-y border-slate-100 bg-slate-50/70">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Picked from our shops</p>
                            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Fresh finds for you</h2>
                        </div>
                        <Link href={route('storefront.products.index')} className="mb-1 inline-flex shrink-0 items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800">
                            All products <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    {products.length > 0 ? (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {products.map((listing) => <ProductCard key={listing.id} listing={listing} />)}
                        </div>
                    ) : (
                        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                            <ShoppingBag className="mx-auto size-9 text-slate-400" />
                            <h3 className="mt-3 font-bold text-slate-800">Products are on the way</h3>
                            <p className="mt-1 text-sm text-slate-500">Check back soon to discover items from our shops.</p>
                        </div>
                    )}
                </div>
            </section>

            <section id="reviews" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Kind words</p>
                    <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl">What our customers say</h2>
                </div>
                {testimonials.length > 0 ? (
                    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((testimonial) => (
                            <article key={testimonial.id} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex gap-0.5" aria-label={`${testimonial.rating} out of 5 stars`}>
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <Star key={index} className={`size-4 ${index < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                    ))}
                                </div>
                                <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">“{testimonial.review}”</p>
                                <div className="mt-5 border-t border-slate-100 pt-4">
                                    <p className="font-bold text-slate-900">{testimonial.reviewer_name}</p>
                                    {testimonial.reviewer_title && <p className="mt-0.5 text-xs text-slate-500">{testimonial.reviewer_title}</p>}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="mt-7 text-center text-sm text-slate-500">Customer reviews will appear here soon.</p>
                )}
            </section>

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
                    <div className="sm:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2.5">
                            <img src="/images/logo.png" alt="" className="size-10 rounded-lg object-contain" />
                            <span className="text-lg font-extrabold tracking-tight">Marketplace</span>
                        </Link>
                        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">A home for independent shops and the products they love.</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Explore</h3>
                        <div className="mt-3 grid gap-2 text-sm text-slate-600">
                            <Link href={route('storefront.products.index')} className="hover:text-emerald-700">All products</Link>
                            <Link href={route('storefront.stores.index')} className="hover:text-emerald-700">All stores</Link>
                            <a href="#reviews" className="hover:text-emerald-700">Customer reviews</a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">For shop owners</h3>
                        <div className="mt-3 grid gap-2 text-sm text-slate-600">
                            <Link href={route('login')} className="hover:text-emerald-700">Sign in</Link>
                            <Link href={route('register')} className="hover:text-emerald-700">Create an account</Link>
                        </div>
                    </div>
                </div>
                <div className="border-t border-slate-100">
                    <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-slate-500 sm:px-6 lg:px-8">© {new Date().getFullYear()} Marketplace. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}

function Feature({ icon: Icon, title, description }: { icon: typeof Store; title: string; description: string }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 sm:px-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="size-5" /></span>
            <span>
                <span className="block text-sm font-bold text-slate-800">{title}</span>
                <span className="mt-0.5 block text-xs leading-5 text-slate-500">{description}</span>
            </span>
        </div>
    );
}

function ProductCard({ listing }: { listing: ProductListing }) {
    const imagePath = listing.thumbnail ?? listing.product.thumbnail;
    const image = imagePath ? `/storage/${imagePath}` : '/images/product-placeholder.svg';

    return (
        <Link
            href={route('storefront.product', [listing.shop.slug, listing.product.slug])}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img src={image} onError={(event) => { event.currentTarget.src = '/images/product-placeholder.svg'; }} alt={listing.product.name} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 max-w-[75%] truncate rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
                    {listing.shop.name}
                </span>
            </div>
            <div className="p-4">
                <h3 className="line-clamp-1 font-bold text-slate-900">{listing.product.name}</h3>
                <p className="mt-1.5 min-h-10 line-clamp-2 text-sm leading-5 text-slate-500">{listing.description ?? listing.product.description ?? 'Discover more at this independent shop.'}</p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-lg font-extrabold text-emerald-700">{listing.price}</span>
                    <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white"><ArrowUpRight className="size-4" /></span>
                </div>
            </div>
        </Link>
    );
}
