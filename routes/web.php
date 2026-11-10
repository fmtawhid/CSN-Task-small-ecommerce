<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Owner\CatalogController as OwnerCatalogController;
use App\Http\Controllers\Owner\DashboardController as OwnerDashboardController;
use App\Http\Controllers\Owner\ListingController as OwnerListingController;
use App\Http\Controllers\Owner\OrderController as OwnerOrderController;
use App\Http\Controllers\Storefront\CatalogController as StorefrontCatalogController;
use App\Http\Controllers\Storefront\CheckoutController as StorefrontCheckoutController;
use App\Http\Controllers\Storefront\ShopController as StorefrontShopController;

Route::get('/', [StorefrontShopController::class, 'index'])->name('home');
Route::get('/products', [StorefrontCatalogController::class, 'products'])->name('storefront.products.index');
Route::get('/stores', [StorefrontCatalogController::class, 'shops'])->name('storefront.stores.index');
Route::get('/cart', [StorefrontCheckoutController::class, 'index'])->name('storefront.cart.index');
Route::post('/orders', [StorefrontCheckoutController::class, 'store'])->middleware('throttle:10,1')->name('storefront.orders.store');
Route::get('/order-confirmation', [StorefrontCheckoutController::class, 'confirmation'])->name('storefront.order-confirmation');

Route::get('/shop/{shop:slug}', [StorefrontShopController::class, 'show'])->name('storefront.shop');
Route::get('/shop/{shop:slug}/products/{product}', [StorefrontShopController::class, 'product'])->name('storefront.product');

Route::middleware(['auth', 'user.role:shop_owner'])
    ->prefix('owner')
    ->as('owner.')
    ->group(function () {
        Route::get('dashboard', OwnerDashboardController::class)->name('dashboard');
        Route::get('orders', [OwnerOrderController::class, 'index'])->name('orders.index');
        Route::patch('orders/{order}/status', [OwnerOrderController::class, 'update'])->name('orders.update');
        Route::get('catalog', [OwnerCatalogController::class, 'index'])->name('catalog.index');
        Route::post('catalog/{product}', [OwnerCatalogController::class, 'store'])->name('catalog.store');
        Route::get('listings', [OwnerListingController::class, 'index'])->name('listings.index');
        Route::get('products/create', [OwnerListingController::class, 'create'])->name('products.create');
        Route::post('products', [OwnerListingController::class, 'store'])->name('products.store');
        Route::get('listings/{listing}/edit', [OwnerListingController::class, 'edit'])->name('listings.edit');
        Route::put('listings/{listing}', [OwnerListingController::class, 'update'])->name('listings.update');
        Route::delete('listings/{listing}', [OwnerListingController::class, 'destroy'])->name('listings.destroy');
    });

// dashboard route
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'totalContacts' => \App\Models\Contact::count(),
            'totalEmails' => \App\Models\Email::count(),
        ]);
    })->name('dashboard');
});

// Contact routes
Route::post('/contacts/store', [App\Http\Controllers\ContactController::class, 'store'])->name('contacts.store');

// Email subscription routes
Route::post('/emails/store', [App\Http\Controllers\EmailController::class, 'store'])->name('emails.store');

//role manager


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
