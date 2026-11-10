<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'shops' => Shop::count(),
                'activeShops' => Shop::where('status', 'active')->count(),
                'owners' => User::where('role', 'shop_owner')->count(),
                'products' => Product::count(),
                'activeProducts' => Product::where('is_active', true)->count(),
                'listings' => ShopProduct::count(),
            ],
        ]);
    }
}
