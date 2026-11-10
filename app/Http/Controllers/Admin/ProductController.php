<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductRequest;
use App\Models\Product;
use App\Support\PublicImageUploader;
use App\Support\UniqueSlug;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/products/index', [
            'products' => Product::with('creator:id,name')->withCount('listings')->latest()->paginate(15),
        ]);
    }

    public function create(): Response
    {
        return $this->form();
    }

    public function store(ProductRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['created_by'] = $request->user()->id;
        $data['slug'] = $data['slug'] ?: UniqueSlug::make($data['name'], Product::class);
        $data['thumbnail'] = PublicImageUploader::store($request->file('thumbnail'), 'products');
        Product::create($data);

        return to_route('admin.products.index')->with('success', 'Catalog product created.');
    }

    public function edit(Product $product): Response
    {
        return $this->form($product);
    }

    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?: UniqueSlug::make($data['name'], Product::class, $product->id);
        if ($request->file('thumbnail') !== null) {
            $oldThumbnail = $product->thumbnail;
            $data['thumbnail'] = PublicImageUploader::store($request->file('thumbnail'), 'products');
        } else {
            unset($data['thumbnail']);
        }
        $product->update($data);
        if (isset($oldThumbnail) && $oldThumbnail) {
            Storage::disk('public')->delete($oldThumbnail);
        }

        return to_route('admin.products.index')->with('success', 'Catalog product updated.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $thumbnail = $product->thumbnail;
        $listingThumbnails = $product->listings()->whereNotNull('thumbnail')->pluck('thumbnail');
        $product->delete();
        if ($thumbnail) {
            Storage::disk('public')->delete($thumbnail);
        }
        foreach ($listingThumbnails as $listingThumbnail) {
            Storage::disk('public')->delete($listingThumbnail);
        }

        return back()->with('success', 'Catalog product and its listings deleted.');
    }

    private function form(?Product $product = null): Response
    {
        return Inertia::render('admin/products/form', [
            'product' => $product?->only('id', 'name', 'slug', 'description', 'thumbnail', 'is_active'),
        ]);
    }
}
