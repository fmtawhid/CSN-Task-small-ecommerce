<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ShopRequest;
use App\Models\Shop;
use App\Models\User;
use App\Support\PublicImageUploader;
use App\Support\UniqueSlug;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/shops/index', [
            'shops' => Shop::with('owner:id,name,email')->withCount('listings')->latest()->paginate(15),
            'owners' => User::where('role', 'shop_owner')->select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return $this->form();
    }

    public function store(ShopRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?: UniqueSlug::make($data['name'], Shop::class);
        $data['logo'] = PublicImageUploader::store($request->file('logo'), 'shops', 'logo');
        Shop::create($data);

        return to_route('admin.shops.index')->with('success', 'Shop created.');
    }

    public function edit(Shop $shop): Response
    {
        return $this->form($shop);
    }

    public function update(ShopRequest $request, Shop $shop): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?: UniqueSlug::make($data['name'], Shop::class, $shop->id);

        if ($request->file('logo') !== null) {
            $oldLogo = $shop->logo;
            $data['logo'] = PublicImageUploader::store($request->file('logo'), 'shops', 'logo');
        } else {
            unset($data['logo']);
        }

        $shop->update($data);
        if (isset($oldLogo) && $oldLogo) {
            Storage::disk('public')->delete($oldLogo);
        }

        return to_route('admin.shops.index')->with('success', 'Shop updated.');
    }

    public function destroy(Shop $shop): RedirectResponse
    {
        $listingThumbnails = $shop->listings()->whereNotNull('thumbnail')->pluck('thumbnail');
        DB::transaction(fn () => $shop->delete());
        if ($shop->logo) {
            Storage::disk('public')->delete($shop->logo);
        }
        foreach ($listingThumbnails as $thumbnail) {
            Storage::disk('public')->delete($thumbnail);
        }

        return back()->with('success', 'Shop and its listings removed.');
    }

    private function form(?Shop $shop = null): Response
    {
        return Inertia::render('admin/shops/form', [
            'shop' => $shop?->only('id', 'owner_id', 'name', 'slug', 'description', 'logo', 'status'),
            'owners' => User::where('role', 'shop_owner')->select('id', 'name')->orderBy('name')->get(),
        ]);
    }
}
