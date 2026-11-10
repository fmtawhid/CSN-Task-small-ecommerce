<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HomepageContentController;
use App\Http\Controllers\Admin\ListingController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ShopController;
use App\Http\Controllers\Admin\ShopOwnerController;

Route::middleware(['auth', 'user.role:admin'])
    ->prefix('admin')
    ->as('admin.')
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::get('homepage', [HomepageContentController::class, 'index'])->name('homepage.index');
        Route::post('homepage/slides', [HomepageContentController::class, 'storeSlide'])->name('homepage.slides.store');
        Route::put('homepage/slides/{slide}', [HomepageContentController::class, 'updateSlide'])->name('homepage.slides.update');
        Route::delete('homepage/slides/{slide}', [HomepageContentController::class, 'destroySlide'])->name('homepage.slides.destroy');
        Route::post('homepage/reviews', [HomepageContentController::class, 'storeTestimonial'])->name('homepage.reviews.store');
        Route::put('homepage/reviews/{testimonial}', [HomepageContentController::class, 'updateTestimonial'])->name('homepage.reviews.update');
        Route::delete('homepage/reviews/{testimonial}', [HomepageContentController::class, 'destroyTestimonial'])->name('homepage.reviews.destroy');
        Route::resource('shops', ShopController::class)->except('show');
        Route::resource('owners', ShopOwnerController::class)->except('show');
        Route::resource('products', ProductController::class)->except('show');
        Route::get('listings', [ListingController::class, 'index'])->name('listings.index');
        Route::patch('listings/{listing}/toggle', [ListingController::class, 'toggle'])->name('listings.toggle');
        Route::resource('roles', RoleController::class);
        Route::resource('permissions', PermissionController::class);
        Route::resource('users', UserController::class);
        Route::get('contacts', [\App\Http\Controllers\ContactController::class, 'index'])->name('contacts.index');
        Route::delete('contacts/{contact}', [\App\Http\Controllers\ContactController::class, 'destroy'])->name('contacts.destroy');
        Route::get('emails', [\App\Http\Controllers\EmailController::class, 'index'])->name('emails.index');
        Route::delete('emails/{email}', [\App\Http\Controllers\EmailController::class, 'destroy'])->name('emails.destroy');
    });
