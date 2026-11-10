<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HomepageSlideRequest;
use App\Http\Requests\Admin\TestimonialRequest;
use App\Models\HomepageSlide;
use App\Models\Testimonial;
use App\Support\PublicImageUploader;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HomepageContentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/homepage/index', [
            'slides' => HomepageSlide::query()->orderBy('sort_order')->orderBy('id')->get(),
            'testimonials' => Testimonial::query()->orderBy('sort_order')->orderBy('id')->get(),
        ]);
    }

    public function storeSlide(HomepageSlideRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['image'] = PublicImageUploader::store($request->file('image'), 'homepage-slides', 'image');
        HomepageSlide::create($data);

        return back()->with('success', 'Homepage slide added.');
    }

    public function updateSlide(HomepageSlideRequest $request, HomepageSlide $slide): RedirectResponse
    {
        $data = $request->validated();
        if ($request->file('image') !== null) {
            $oldImage = $slide->image;
            $data['image'] = PublicImageUploader::store($request->file('image'), 'homepage-slides', 'image');
        } else {
            unset($data['image']);
        }

        $slide->update($data);
        if (isset($oldImage) && ! str_starts_with($oldImage, '/')) {
            PublicImageUploader::delete($oldImage);
        }

        return back()->with('success', 'Homepage slide updated.');
    }

    public function destroySlide(HomepageSlide $slide): RedirectResponse
    {
        $image = $slide->image;
        $slide->delete();
        if (! str_starts_with($image, '/')) {
            PublicImageUploader::delete($image);
        }

        return back()->with('success', 'Homepage slide removed.');
    }

    public function storeTestimonial(TestimonialRequest $request): RedirectResponse
    {
        Testimonial::create($request->validated());

        return back()->with('success', 'Review added.');
    }

    public function updateTestimonial(TestimonialRequest $request, Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update($request->validated());

        return back()->with('success', 'Review updated.');
    }

    public function destroyTestimonial(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        return back()->with('success', 'Review removed.');
    }
}
