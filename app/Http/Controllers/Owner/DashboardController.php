<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $user = request()->user();
        $shop = $user->shop;
        $listings = $shop?->listings();

        return Inertia::render('owner/dashboard', [
            'shop' => $shop?->only('id', 'name', 'slug', 'status'),
            'stats' => $shop ? [
                'products' => (clone $listings)->count(),
                'activeListings' => $shop->status === 'active'
                    ? (clone $listings)->where('is_active', true)
                        ->whereHas('product', fn ($query) => $query->where('is_active', true))->count()
                    : 0,
                'pendingOrders' => $shop->orders()->where('status', 'pending')->count(),
            ] : null,
            'recentProducts' => $listings?->with('product:id,name,thumbnail,is_active')
                ->latest()->limit(4)->get(),
        ]);
    }
}
