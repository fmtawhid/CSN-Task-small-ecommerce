import AppLogoIcon from '@/components/app-logo-icon';
import MarketplaceNav from '@/components/marketplace-nav';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen bg-white">
            <MarketplaceNav />
            <div className="grid min-h-[calc(100vh-7rem)] bg-white lg:grid-cols-2">
            <div className="hidden flex-col border-r border-slate-100 bg-white p-10 lg:flex">
                <Link href={route('home')} className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <AppLogoIcon className="size-10" />
                    Marketplace
                </Link>
                <div className="my-auto max-w-lg">
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Independent shops, one marketplace</p>
                    <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
                        Discover products from shops worth knowing.
                    </h2>
                    <p className="mt-4 leading-7 text-slate-600">
                        Find unique products, explore independent stores, and manage your shop securely.
                    </p>
                </div>
            </div>

            <div className="flex w-full items-center justify-center bg-white px-6 py-10 sm:px-10 lg:p-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
                >
                    <div className="space-y-3 text-center">
                        <Link href={route('home')} className="mx-auto inline-flex items-center gap-2 font-bold text-slate-900">
                            <AppLogoIcon className="size-10" /> Marketplace
                        </Link>
                        <h1 className="pt-3 text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
                        {description && <p className="text-sm text-slate-500">{description}</p>}
                    </div>

                    {children}
                </motion.div>
            </div>
            </div>
        </div>
    );
}
