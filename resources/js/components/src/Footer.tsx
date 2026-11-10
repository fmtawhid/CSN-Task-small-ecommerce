import { Link, useForm } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';
import { useState, type FormEvent } from 'react';

export default function Footer() {
    const [message, setMessage] = useState('');
    const { data, setData, post, processing, reset } = useForm({ email: '' });

    const subscribe = (event: FormEvent) => {
        event.preventDefault();
        post(route('emails.store'), {
            onSuccess: () => {
                setMessage('You are subscribed.');
                reset();
            },
            onError: () => setMessage('Unable to subscribe right now.'),
        });
    };

    return (
        <footer className="border-t bg-card">
            <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-2 sm:items-center">
                <div>
                    <Link href="/" className="flex items-center gap-2 text-lg font-bold">
                        <ShoppingBag className="size-5 text-primary" />
                        Marketplace
                    </Link>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                        Discover products from independent shops, all in one place.
                    </p>
                </div>
                <form onSubmit={subscribe} className="flex flex-col gap-2 sm:items-end">
                    <label htmlFor="marketplace-email" className="text-sm font-medium">Get marketplace updates</label>
                    <div className="flex w-full max-w-md gap-2">
                        <input
                            id="marketplace-email"
                            type="email"
                            required
                            value={data.email}
                            onChange={(event) => setData('email', event.target.value)}
                            placeholder="Email address"
                            className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                        />
                        <button disabled={processing} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
                            Subscribe
                        </button>
                    </div>
                    {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
                </form>
            </div>
            <div className="border-t py-4 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Marketplace. All rights reserved.
            </div>
        </footer>
    );
}
