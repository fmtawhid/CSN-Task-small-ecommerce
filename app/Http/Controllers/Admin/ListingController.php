<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\ShopProduct;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ListingController extends Controller
{
    public function index(Request $request): Response
    {
        $listings = ShopProduct::with(['shop:id,name,slug', 'product:id,name,slug,is_active'])
            ->when($request->filled('shop'), fn ($query) => $query->where('shop_id', $request->integer('shop')))
            ->latest()->paginate(20)->withQueryString();

        return Inertia::render('admin/listings/index', [
            'listings' => $listings,
            'shops' => Shop::select('id', 'name')->orderBy('name')->get(),
            'filters' => $request->only('shop'),
        ]);
    }

    public function toggle(ShopProduct $listing): RedirectResponse
    {
        $listing->update(['is_active' => ! $listing->is_active]);

        return back()->with('success', 'Listing status updated.');
    }
}
