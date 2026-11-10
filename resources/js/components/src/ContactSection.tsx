import { useForm } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';

export default function ContactSection() {
    const [message, setMessage] = useState('');
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(route('contacts.store'), {
            onSuccess: () => {
                setMessage('Your message has been sent.');
                reset();
            },
            onError: () => setMessage('Please check your information and try again.'),
        });
    };

    return (
        <section className="mx-auto max-w-3xl px-5 py-16">
            <div className="text-center">
                <p className="text-sm font-semibold text-primary">Contact</p>
                <h2 className="mt-2 text-3xl font-bold">How can we help?</h2>
                <p className="mt-3 text-muted-foreground">Send a message to the marketplace team.</p>
            </div>
            <form onSubmit={submit} className="mt-8 space-y-4 rounded-xl border bg-card p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1.5 text-sm font-medium">Name
                        <input required value={data.name} onChange={(event) => setData('name', event.target.value)} className="rounded-md border bg-background px-3 py-2" />
                        {errors.name && <span className="text-destructive">{errors.name}</span>}
                    </label>
                    <label className="grid gap-1.5 text-sm font-medium">Email
                        <input required type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} className="rounded-md border bg-background px-3 py-2" />
                        {errors.email && <span className="text-destructive">{errors.email}</span>}
                    </label>
                </div>
                <label className="grid gap-1.5 text-sm font-medium">Subject
                    <input required value={data.subject} onChange={(event) => setData('subject', event.target.value)} className="rounded-md border bg-background px-3 py-2" />
                    {errors.subject && <span className="text-destructive">{errors.subject}</span>}
                </label>
                <label className="grid gap-1.5 text-sm font-medium">Message
                    <textarea required rows={5} value={data.message} onChange={(event) => setData('message', event.target.value)} className="rounded-md border bg-background px-3 py-2" />
                    {errors.message && <span className="text-destructive">{errors.message}</span>}
                </label>
                <button disabled={processing} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground disabled:opacity-50">
                    <Send className="size-4" /> {processing ? 'Sending...' : 'Send message'}
                </button>
                {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
            </form>
        </section>
    );
}
