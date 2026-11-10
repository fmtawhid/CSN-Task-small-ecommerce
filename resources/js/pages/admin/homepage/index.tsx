import { CommercePage, FieldError } from '@/components/commerce';
import { Button } from '@/components/ui/button';
import { useForm, router } from '@inertiajs/react';
import { ImagePlus, MessageSquareQuote, PanelsTopLeft, Star, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { FormEvent } from 'react';

type Slide = {
    id: number;
    title: string;
    subtitle: string | null;
    image: string;
    button_text: string | null;
    button_url: string | null;
    sort_order: number;
    is_active: boolean;
};

type Testimonial = {
    id: number;
    reviewer_name: string;
    reviewer_title: string | null;
    review: string;
    rating: number;
    sort_order: number;
    is_active: boolean;
};

export default function HomepageContent({ slides, testimonials }: { slides: Slide[]; testimonials: Testimonial[] }) {
    return (
        <CommercePage title="Homepage content">
            <p className="-mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                Manage the public homepage carousel and customer reviews. Only active items appear to visitors; lower sort numbers appear first.
            </p>

            <section className="space-y-5">
                <div className="flex items-center gap-3 border-b pb-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><PanelsTopLeft className="size-5" /></span>
                    <div><h2 className="text-xl font-bold">Hero carousel</h2><p className="text-sm text-muted-foreground">{slides.length} slides</p></div>
                </div>
                <p className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                    Recommended image size: <strong>1920 × 720 px</strong> (8:3 ratio), JPG/PNG/WebP, up to 5 MB. Each slide uses one image.
                </p>
                <NewSlideForm />
                {slides.length > 0 ? (
                    <div className="grid gap-5 xl:grid-cols-2">
                        {slides.map((slide) => <SlideForm key={slide.id} slide={slide} />)}
                    </div>
                ) : (
                    <EmptyState icon={ImagePlus} text="No banner slides yet. Add the first slide above." />
                )}
            </section>

            <section className="space-y-5 border-t pt-8">
                <div className="flex items-center gap-3 border-b pb-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><MessageSquareQuote className="size-5" /></span>
                    <div><h2 className="text-xl font-bold">Customer reviews</h2><p className="text-sm text-muted-foreground">{testimonials.length} reviews</p></div>
                </div>
                <NewTestimonialForm />
                {testimonials.length > 0 ? (
                    <div className="grid gap-5 xl:grid-cols-2">
                        {testimonials.map((testimonial) => <TestimonialForm key={testimonial.id} testimonial={testimonial} />)}
                    </div>
                ) : (
                    <EmptyState icon={MessageSquareQuote} text="No customer reviews yet. Add a review above when you are ready to publish one." />
                )}
            </section>
        </CommercePage>
    );
}

function NewSlideForm() {
    const form = useForm({
        title: '', subtitle: '', image: null as File | null, button_text: '', button_url: '', sort_order: 0, is_active: Boolean(true),
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(route('admin.homepage.slides.store'), { forceFormData: true, preserveScroll: true, onSuccess: () => form.reset() });
    };

    return (
        <form onSubmit={submit} className="grid gap-4 rounded-xl border bg-card p-5 md:grid-cols-2">
            <div className="md:col-span-2"><h3 className="font-semibold">Add banner slide</h3></div>
            <TextField label="Headline" value={form.data.title} onChange={(value) => form.setData('title', value)} error={form.errors.title} required />
            <TextField label="Button label (optional)" value={form.data.button_text} onChange={(value) => form.setData('button_text', value)} error={form.errors.button_text} />
            <TextAreaField label="Description" value={form.data.subtitle} onChange={(value) => form.setData('subtitle', value)} error={form.errors.subtitle} />
            <TextField label="Button link (optional; URL or /path)" value={form.data.button_url} onChange={(value) => form.setData('button_url', value)} error={form.errors.button_url} />
            <ImageField label="Slide image" value={form.data.image} onChange={(value) => form.setData('image', value)} error={form.errors.image} required />
            <OrderField value={form.data.sort_order} onChange={(value) => form.setData('sort_order', value)} error={form.errors.sort_order} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} /> Publish this slide</label>
            <div className="md:col-span-2"><Button disabled={form.processing}><ImagePlus className="mr-2 size-4" /> Add slide</Button></div>
        </form>
    );
}

function SlideForm({ slide }: { slide: Slide }) {
    const form = useForm({
        title: slide.title, subtitle: slide.subtitle ?? '', image: null as File | null,
        button_text: slide.button_text ?? '', button_url: slide.button_url ?? '',
        sort_order: slide.sort_order, is_active: slide.is_active,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform((data) => ({ ...data, _method: 'put' }));
        form.post(route('admin.homepage.slides.update', slide.id), { forceFormData: true, preserveScroll: true });
    };
    const remove = () => {
        if (window.confirm(`Remove the "${slide.title}" banner slide?`)) {
            router.delete(route('admin.homepage.slides.destroy', slide.id), { preserveScroll: true });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4 rounded-xl border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
                <div><h3 className="font-semibold">Slide #{slide.sort_order + 1}</h3><p className="text-xs text-muted-foreground">Current image is shown until replaced.</p></div>
                <Button type="button" variant="destructive" size="icon" aria-label="Delete slide" onClick={remove}><Trash2 className="size-4" /></Button>
            </div>
            <img src={slide.image.startsWith('/') ? slide.image : `/storage/${slide.image}`} alt="" className="h-40 w-full rounded-lg border object-cover" />
            <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Headline" value={form.data.title} onChange={(value) => form.setData('title', value)} error={form.errors.title} required />
                <TextField label="Button label" value={form.data.button_text} onChange={(value) => form.setData('button_text', value)} error={form.errors.button_text} />
                <TextAreaField label="Description" value={form.data.subtitle} onChange={(value) => form.setData('subtitle', value)} error={form.errors.subtitle} />
                <TextField label="Button link (URL or /path)" value={form.data.button_url} onChange={(value) => form.setData('button_url', value)} error={form.errors.button_url} />
                <ImageField label="Replace image (optional)" value={form.data.image} onChange={(value) => form.setData('image', value)} error={form.errors.image} />
                <OrderField value={form.data.sort_order} onChange={(value) => form.setData('sort_order', value)} error={form.errors.sort_order} />
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} /> Published</label>
            <Button disabled={form.processing}>Save slide</Button>
        </form>
    );
}

function NewTestimonialForm() {
    const form = useForm({
        reviewer_name: '', reviewer_title: '', review: '', rating: 5, sort_order: 0, is_active: Boolean(true),
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(route('admin.homepage.reviews.store'), { preserveScroll: true, onSuccess: () => form.reset() });
    };

    return (
        <form onSubmit={submit} className="grid gap-4 rounded-xl border bg-card p-5 md:grid-cols-2">
            <div className="md:col-span-2"><h3 className="font-semibold">Add customer review</h3></div>
            <TextField label="Customer name" value={form.data.reviewer_name} onChange={(value) => form.setData('reviewer_name', value)} error={form.errors.reviewer_name} required />
            <TextField label="Role or location (optional)" value={form.data.reviewer_title} onChange={(value) => form.setData('reviewer_title', value)} error={form.errors.reviewer_title} />
            <TextAreaField label="Review" value={form.data.review} onChange={(value) => form.setData('review', value)} error={form.errors.review} required />
            <div className="grid grid-cols-2 gap-3">
                <RatingField value={form.data.rating} onChange={(value) => form.setData('rating', value)} error={form.errors.rating} />
                <OrderField value={form.data.sort_order} onChange={(value) => form.setData('sort_order', value)} error={form.errors.sort_order} />
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} /> Publish this review</label>
            <div className="md:col-span-2"><Button disabled={form.processing}><MessageSquareQuote className="mr-2 size-4" /> Add review</Button></div>
        </form>
    );
}

function TestimonialForm({ testimonial }: { testimonial: Testimonial }) {
    const form = useForm({
        reviewer_name: testimonial.reviewer_name, reviewer_title: testimonial.reviewer_title ?? '',
        review: testimonial.review, rating: testimonial.rating, sort_order: testimonial.sort_order,
        is_active: testimonial.is_active,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform((data) => ({ ...data, _method: 'put' }));
        form.post(route('admin.homepage.reviews.update', testimonial.id), { preserveScroll: true });
    };
    const remove = () => {
        if (window.confirm(`Remove the review from "${testimonial.reviewer_name}"?`)) {
            router.delete(route('admin.homepage.reviews.destroy', testimonial.id), { preserveScroll: true });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4 rounded-xl border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-1"><Star className="size-4 fill-amber-400 text-amber-400" /><span className="text-sm font-semibold">{testimonial.rating}/5</span></div>
                <Button type="button" variant="destructive" size="icon" aria-label="Delete review" onClick={remove}><Trash2 className="size-4" /></Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Customer name" value={form.data.reviewer_name} onChange={(value) => form.setData('reviewer_name', value)} error={form.errors.reviewer_name} required />
                <TextField label="Role or location" value={form.data.reviewer_title} onChange={(value) => form.setData('reviewer_title', value)} error={form.errors.reviewer_title} />
                <TextAreaField label="Review" value={form.data.review} onChange={(value) => form.setData('review', value)} error={form.errors.review} required />
                <div className="grid grid-cols-2 gap-3">
                    <RatingField value={form.data.rating} onChange={(value) => form.setData('rating', value)} error={form.errors.rating} />
                    <OrderField value={form.data.sort_order} onChange={(value) => form.setData('sort_order', value)} error={form.errors.sort_order} />
                </div>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} /> Published</label>
            <Button disabled={form.processing}>Save review</Button>
        </form>
    );
}

function TextField({ label, value, onChange, error, required = false }: { label: string; value: string; onChange: (value: string) => void; error?: string; required?: boolean }) {
    return (
        <label className="grid gap-1.5 text-sm font-medium">{label}
            <input value={value} required={required} onChange={(event) => onChange(event.target.value)} className="rounded-md border bg-background px-3 py-2 font-normal" />
            <FieldError message={error} />
        </label>
    );
}

function TextAreaField({ label, value, onChange, error, required = false }: { label: string; value: string; onChange: (value: string) => void; error?: string; required?: boolean }) {
    return (
        <label className="grid gap-1.5 text-sm font-medium">{label}
            <textarea value={value} required={required} onChange={(event) => onChange(event.target.value)} rows={3} className="rounded-md border bg-background px-3 py-2 font-normal" />
            <FieldError message={error} />
        </label>
    );
}

function ImageField({ label, value, onChange, error, required = false }: { label: string; value: File | null; onChange: (value: File | null) => void; error?: string; required?: boolean }) {
    return (
        <label className="grid gap-1.5 text-sm font-medium">{label}
            <input type="file" accept="image/jpeg,image/png,image/webp" required={required} onChange={(event) => onChange(event.target.files?.[0] ?? null)} className="text-sm font-normal file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-semibold file:text-emerald-800" />
            {value && <span className="truncate text-xs text-muted-foreground">{value.name}</span>}
            <FieldError message={error} />
        </label>
    );
}

function OrderField({ value, onChange, error }: { value: number; onChange: (value: number) => void; error?: string }) {
    return (
        <label className="grid gap-1.5 text-sm font-medium">Display order
            <input type="number" min="0" value={value} onChange={(event) => onChange(Number(event.target.value))} className="rounded-md border bg-background px-3 py-2 font-normal" />
            <FieldError message={error} />
        </label>
    );
}

function RatingField({ value, onChange, error }: { value: number; onChange: (value: number) => void; error?: string }) {
    return (
        <label className="grid gap-1.5 text-sm font-medium">Rating
            <select value={value} onChange={(event) => onChange(Number(event.target.value))} className="rounded-md border bg-background px-3 py-2 font-normal">
                {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}
            </select>
            <FieldError message={error} />
        </label>
    );
}

function EmptyState({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
    return <div className="rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground"><Icon className="mx-auto mb-2 size-7" />{text}</div>;
}
