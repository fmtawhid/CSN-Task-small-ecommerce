<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\HomepageSlide;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('home', [
            'slides' => HomepageSlide::query()->where('is_active', true)->orderBy('sort_order')->orderBy('id')->get([
                'id', 'title', 'subtitle', 'image', 'button_text', 'button_url',
            ]),
            'testimonials' => Testimonial::query()->where('is_active', true)->orderBy('sort_order')->orderBy('id')->get([
                'id', 'reviewer_name', 'reviewer_title', 'review', 'rating',
            ]),
            'products' => ShopProduct::query()
                ->where('is_active', true)
                ->whereHas('shop', fn (Builder $shop) => $shop->where('status', 'active'))
                ->whereHas('product', fn (Builder $product) => $product->where('is_active', true))
                ->with([
                    'shop:id,name,slug',
                    'product:id,name,slug,description,thumbnail',
                ])
                ->latest()
                ->limit(8)
                ->get(['id', 'shop_id', 'product_id', 'price', 'description', 'thumbnail']),
        ]);
    }

    public function show(Shop $shop): Response
    {
        abort_unless($shop->status === 'active', 404);
        $shop->load('owner:id,name');
        $shop->loadCount([
            'listings as published_products_count' => fn (Builder $query) => $query
                ->where('is_active', true)
                ->whereHas('product', fn (Builder $product) => $product->where('is_active', true)),
        ]);
        $listings = ShopProduct::query()->where('shop_id', $shop->id)->where('is_active', true)
            ->whereHas('product', fn ($query) => $query->where('is_active', true))
            ->with('product:id,name,slug,description,thumbnail')
            ->latest()->paginate(16);

        return Inertia::render('storefront/shop', [
            'shop' => [
                ...$shop->only('id', 'name', 'slug', 'description', 'logo'),
                'owner_name' => $shop->owner->name,
                'published_products_count' => $shop->published_products_count,
                'member_since' => $shop->created_at?->format('F Y'),
            ],
            'listings' => $listings,
        ]);
    }

    public function product(Shop $shop, string $product): Response
    {
        abort_unless($shop->status === 'active', 404);
        $listing = ShopProduct::query()->where('shop_id', $shop->id)->where('is_active', true)
            ->whereHas('product', fn ($query) => $query->where('slug', $product)->where('is_active', true))
            ->with('product:id,name,slug,description,thumbnail')
            ->firstOrFail();

        return Inertia::render('storefront/product', [
            'shop' => $shop->only('id', 'name', 'slug'),
            'listing' => $listing,
        ]);
    }
}
