import { Link } from '@inertiajs/react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                    <ShoppingBag className="size-6 text-primary" />
                    Marketplace
                </Link>
                <div className="hidden items-center gap-6 sm:flex">
                    <a href="/#products" className="text-sm text-muted-foreground hover:text-foreground">Products</a>
                    <a href="/#shops" className="text-sm text-muted-foreground hover:text-foreground">Shops</a>
                    <Link href="/login" className="text-sm font-medium">Sign in</Link>
                    <Link href="/register" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Create account</Link>
                </div>
                <button type="button" className="sm:hidden" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
                    {open ? <X /> : <Menu />}
                </button>
            </nav>
            {open && (
                <div className="grid gap-3 border-t px-5 py-4 sm:hidden">
                    <a href="/#products" onClick={() => setOpen(false)}>Products</a>
                    <a href="/#shops" onClick={() => setOpen(false)}>Shops</a>
                    <Link href="/login">Sign in</Link>
                    <Link href="/register">Create account</Link>
                </div>
            )}
        </header>
    );
}
