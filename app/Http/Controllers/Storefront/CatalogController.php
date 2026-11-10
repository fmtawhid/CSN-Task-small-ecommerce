<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\ShopProduct;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function products(Request $request): Response
    {
        $products = ShopProduct::query()
            ->where('is_active', true)
            ->whereHas('shop', fn (Builder $shop) => $shop->where('status', 'active'))
            ->whereHas('product', fn (Builder $product) => $product->where('is_active', true))
            ->when($request->filled('search'), function (Builder $query) use ($request) {
                $term = trim($request->string('search')->toString());
                $query->where(fn (Builder $filter) => $filter
                    ->whereHas('product', fn (Builder $product) => $product->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('shop', fn (Builder $shop) => $shop->where('name', 'like', "%{$term}%")));
            })
            ->with([
                'shop:id,name,slug',
                'product:id,name,slug,description,thumbnail',
            ])
            ->latest()
            ->paginate(16)
            ->withQueryString();

        return Inertia::render('storefront/products', [
            'products' => $products,
            'filters' => $request->only('search'),
        ]);
    }

    public function shops(Request $request): Response
    {
        $shops = Shop::query()
            ->where('status', 'active')
            ->when($request->filled('search'), function (Builder $query) use ($request) {
                $term = trim($request->string('search')->toString());
                $query->where(fn (Builder $shop) => $shop
                    ->where('name', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%"));
            })
            ->withCount(['listings as published_products_count' => fn (Builder $listing) => $listing
                ->where('is_active', true)
                ->whereHas('product', fn (Builder $product) => $product->where('is_active', true))])
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('storefront/stores', [
            'shops' => $shops,
            'filters' => $request->only('search'),
        ]);
    }
}
