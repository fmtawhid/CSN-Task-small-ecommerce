<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Owner\ListingRequest;
use App\Http\Requests\Owner\NewProductRequest;
use App\Models\Product;
use App\Models\ShopProduct;
use App\Support\PublicImageUploader;
use App\Support\UniqueSlug;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ListingController extends Controller
{
    public function index(): Response
    {
        $shop = request()->user()->shop;
        abort_unless($shop, 403, 'A shop must be assigned to your account before managing listings.');

        return Inertia::render('owner/listings/index', [
            'listings' => $shop->listings()
                ->with('product:id,name,slug,thumbnail,is_active')
                ->latest()->paginate(15),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('owner/products/form');
    }

    public function store(NewProductRequest $request): RedirectResponse
    {
        $shop = $request->user()->shop;
        abort_unless($shop, 403, 'A shop must be assigned to your account before creating products.');
        $data = $request->validated();

        DB::transaction(function () use ($request, $data, $shop) {
            $globalThumbnail = PublicImageUploader::store($request->file('thumbnail'), 'products');
            $shopThumbnail = PublicImageUploader::store($request->file('shop_thumbnail'), 'shop-products', 'shop_thumbnail');
            $product = Product::create([
                'created_by' => $request->user()->id,
                'name' => $data['name'],
                'slug' => UniqueSlug::make($data['name'], Product::class),
                'description' => $data['description'] ?? null,
                'thumbnail' => $globalThumbnail,
                'is_active' => true,
            ]);

            $shop->listings()->create([
                'product_id' => $product->id,
                'price' => $data['price'],
                'description' => $data['shop_description'] ?? null,
                'thumbnail' => $shopThumbnail,
                'is_active' => true,
            ]);
        });

        return to_route('owner.listings.index')->with('success', 'Product created, added to your shop, and made available in the shared catalog.');
    }

    public function edit(ShopProduct $listing): Response
    {
        $listing = $this->ownedListing($listing);

        return Inertia::render('owner/listings/form', [
            'listing' => $listing->load('product:id,name,description,thumbnail,is_active'),
        ]);
    }

    public function update(ListingRequest $request, ShopProduct $listing): RedirectResponse
    {
        $listing = $this->ownedListing($listing);
        $data = $request->validated();

        if ($request->file('thumbnail') !== null) {
            $oldThumbnail = $listing->thumbnail;
            $data['thumbnail'] = PublicImageUploader::store($request->file('thumbnail'), 'shop-products');
        } else {
            unset($data['thumbnail']);
        }
        $listing->update($data);
        if (isset($oldThumbnail) && $oldThumbnail) {
            PublicImageUploader::delete($oldThumbnail);
        }

        return to_route('owner.listings.index')->with('success', 'Shop listing updated.');
    }

    public function destroy(ShopProduct $listing): RedirectResponse
    {
        $listing = $this->ownedListing($listing);
        $thumbnail = $listing->thumbnail;
        $listing->delete();
        PublicImageUploader::delete($thumbnail);

        return back()->with('success', 'Product removed from your shop.');
    }

    private function ownedListing(ShopProduct $listing): ShopProduct
    {
        $shop = request()->user()->shop;
        abort_unless($shop, 403);

        $listing = $shop->listings()->with('product')->findOrFail($listing->id);
        $this->authorize('manage', $listing);

        return $listing;
    }
}
