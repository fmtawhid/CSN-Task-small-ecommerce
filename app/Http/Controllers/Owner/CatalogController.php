<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Owner\AddCatalogProductRequest;
use App\Models\Product;
use App\Models\ShopProduct;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(Request $request): Response
    {
        $shop = $request->user()->shop;
        abort_unless($shop, 403, 'A shop must be assigned to your account before browsing the catalog.');

        $products = Product::query()
            ->where('is_active', true)
            ->withExists(['listings as listed_in_shop' => fn ($query) => $query->where('shop_id', $shop->id)])
            ->when($request->filled('search'), function ($query) use ($request) {
                $term = trim($request->string('search')->toString());
                $query->where(fn ($inner) => $inner
                    ->where('name', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%"));
            })
            ->when($request->input('filter') === 'available', fn ($query) => $query->whereDoesntHave(
                'listings',
                fn ($listing) => $listing->where('shop_id', $shop->id)
            ))
            ->with('creator:id,name')
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('owner/catalog/index', [
            'products' => $products,
            'filters' => $request->only('search', 'filter'),
        ]);
    }

    public function store(AddCatalogProductRequest $request, Product $product): RedirectResponse
    {
        $shop = $request->user()->shop;
        abort_unless($shop, 403, 'A shop must be assigned to your account before adding products.');
        abort_unless($product->is_active, 404);

        try {
            $shop->listings()->create([
                'product_id' => $product->id,
                'price' => $request->validated('price'),
                'is_active' => true,
            ]);
        } catch (QueryException $exception) {
            if (! ShopProduct::where('shop_id', $shop->id)->where('product_id', $product->id)->exists()) {
                throw $exception;
            }

            throw ValidationException::withMessages([
                'product' => 'This product is already in your shop.',
            ]);
        }

        return back()->with('success', 'Product added to your shop. You can now customize its details and image.');
    }
}
