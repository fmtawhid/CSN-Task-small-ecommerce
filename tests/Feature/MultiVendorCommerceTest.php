<?php

use App\Models\Product;
use App\Models\HomepageSlide;
use App\Models\Order;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

function makeShop(User $owner, string $name = 'Example shop'): Shop
{
    return Shop::create([
        'owner_id' => $owner->id,
        'name' => $name,
        'slug' => str($name)->slug(),
        'status' => 'active',
    ]);
}

function makeProduct(User $creator, string $name = 'Catalog product'): Product
{
    return Product::create([
        'created_by' => $creator->id,
        'name' => $name,
        'slug' => str($name)->slug(),
        'is_active' => true,
    ]);
}

test('only admins may access admin endpoints', function () {
    $owner = User::factory()->create(['role' => 'shop_owner']);
    $this->actingAs($owner)->get(route('admin.dashboard'))->assertForbidden();
    $this->actingAs($owner)->get(route('admin.homepage.index'))->assertForbidden();

    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin)->get(route('admin.dashboard'))->assertOk();
    $this->actingAs($admin)->get(route('admin.homepage.index'))->assertOk();
});

test('homepage shows active admin-managed slides and reviews only', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $shop = makeShop(User::factory()->create(['role' => 'shop_owner']));
    $product = makeProduct($admin, 'Homepage product');
    ShopProduct::create(['shop_id' => $shop->id, 'product_id' => $product->id, 'price' => 12, 'is_active' => true]);
    HomepageSlide::create(['title' => 'Published banner', 'image' => 'homepage-slides/published.jpg', 'is_active' => true]);
    HomepageSlide::create(['title' => 'Hidden banner', 'image' => 'homepage-slides/hidden.jpg', 'is_active' => false]);
    Testimonial::create(['reviewer_name' => 'Happy customer', 'review' => 'A published customer review.', 'rating' => 5, 'is_active' => true]);
    Testimonial::create(['reviewer_name' => 'Hidden customer', 'review' => 'An unpublished customer review.', 'rating' => 5, 'is_active' => false]);

    $this->get(route('home'))->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('home')
            ->has('slides', 1)
            ->has('testimonials', 1)
            ->has('products', 1)
            ->where('slides.0.title', 'Published banner')
            ->where('testimonials.0.reviewer_name', 'Happy customer'));
});

test('public product and shop directories are searchable and exclude inactive listings', function () {
    $owner = User::factory()->create(['role' => 'shop_owner']);
    $shop = makeShop($owner, 'Directory shop');
    $admin = User::factory()->create(['role' => 'admin']);
    $published = makeProduct($admin, 'Directory product');
    $inactive = makeProduct($admin, 'Hidden directory product');
    $inactive->update(['is_active' => false]);
    ShopProduct::create(['shop_id' => $shop->id, 'product_id' => $published->id, 'price' => 10, 'is_active' => true]);
    ShopProduct::create(['shop_id' => $shop->id, 'product_id' => $inactive->id, 'price' => 11, 'is_active' => true]);

    $this->get(route('storefront.products.index', ['search' => 'Directory']))
        ->assertOk()->assertSee($published->name)->assertDontSee($inactive->name);
    $this->get(route('storefront.stores.index', ['search' => 'Directory']))
        ->assertOk()->assertSee($shop->name);
});

test('admins can upload and update homepage banners and manage customer reviews', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $this->post(route('admin.homepage.slides.store'), [
        'title' => 'Summer collection',
        'subtitle' => 'Seasonal highlights from independent shops.',
        'image' => UploadedFile::fake()->image('banner.jpg', 1920, 720),
        'button_text' => 'Shop now',
        'button_url' => 'https://example.com/products',
        'sort_order' => 0,
        'is_active' => true,
    ])->assertRedirect();
    $slide = HomepageSlide::firstOrFail();
    Storage::disk('public')->assertExists($slide->image);

    $this->post(route('admin.homepage.reviews.store'), [
        'reviewer_name' => 'Customer One',
        'reviewer_title' => 'Verified customer',
        'review' => 'A useful marketplace with great shops.',
        'rating' => 5,
        'sort_order' => 0,
        'is_active' => true,
    ])->assertRedirect();
    $review = Testimonial::firstOrFail();

    $this->put(route('admin.homepage.reviews.update', $review), [
        'reviewer_name' => 'Customer One',
        'reviewer_title' => 'Returning customer',
        'review' => 'Updated review text.',
        'rating' => 4,
        'sort_order' => 0,
        'is_active' => false,
    ])->assertRedirect();
    expect($review->fresh()->review)->toBe('Updated review text.')
        ->and($review->fresh()->is_active)->toBeFalse();
});

test('owners can create products for their own shop', function () {
    $owner = User::factory()->create(['role' => 'shop_owner']);
    $shop = makeShop($owner);
    $this->actingAs($owner);

    $this->post(route('owner.products.store'), [
        'name' => 'My product',
        'description' => 'My own product description',
        'price' => '19.95',
    ])->assertRedirect(route('owner.listings.index'));

    $product = Product::where('created_by', $owner->id)->firstOrFail();
    $listing = ShopProduct::where('shop_id', $shop->id)->where('product_id', $product->id)->firstOrFail();
    expect($listing->exists)->toBeTrue();
});

test('owner product image uploads are persisted to public storage', function () {
    Storage::fake('public');
    $owner = User::factory()->create(['role' => 'shop_owner']);
    makeShop($owner);

    $this->actingAs($owner)->post(route('owner.products.store'), [
        'name' => 'Product with image',
        'price' => '25.00',
        'thumbnail' => UploadedFile::fake()->image('product.jpg'),
    ])->assertRedirect(route('owner.listings.index'));

    $product = Product::where('created_by', $owner->id)->firstOrFail();
    expect($product->thumbnail)->not->toBeNull();
    Storage::disk('public')->assertExists($product->thumbnail);
});

test('new owner products can have shop-specific details and thumbnails without replacing catalog data', function () {
    Storage::fake('public');
    $owner = User::factory()->create(['role' => 'shop_owner']);
    $shop = makeShop($owner);

    $this->actingAs($owner)->post(route('owner.products.store'), [
        'name' => 'Customized product',
        'description' => 'Shared catalog description',
        'thumbnail' => UploadedFile::fake()->image('catalog.jpg'),
        'price' => '31.00',
        'shop_description' => 'Only shown in my shop',
        'shop_thumbnail' => UploadedFile::fake()->image('shop.jpg'),
    ])->assertRedirect(route('owner.listings.index'));

    $product = Product::where('created_by', $owner->id)->firstOrFail();
    $listing = ShopProduct::where('shop_id', $shop->id)->where('product_id', $product->id)->firstOrFail();

    expect($product->description)->toBe('Shared catalog description')
        ->and($listing->description)->toBe('Only shown in my shop')
        ->and($listing->thumbnail)->not->toBeNull()
        ->and($listing->thumbnail)->not->toBe($product->thumbnail);

    Storage::disk('public')->assertExists($product->thumbnail);
    Storage::disk('public')->assertExists($listing->thumbnail);
});

test('owners can add another owner product to their shop and customize only the listing', function () {
    $owner = User::factory()->create(['role' => 'shop_owner']);
    $otherOwner = User::factory()->create(['role' => 'shop_owner']);
    $ownerShop = makeShop($owner);
    $catalogProduct = makeProduct($otherOwner, 'Other owner product');
    $this->actingAs($owner);

    $this->get(route('owner.catalog.index'))->assertOk()->assertSee($catalogProduct->name);
    $this->post(route('owner.catalog.store', $catalogProduct), ['price' => '12.00'])->assertRedirect();
    $listing = ShopProduct::where('shop_id', $ownerShop->id)->where('product_id', $catalogProduct->id)->firstOrFail();
    $this->from(route('owner.catalog.index'))
        ->post(route('owner.catalog.store', $catalogProduct), ['price' => '15.00'])
        ->assertSessionHasErrors('product');

    $this->put(route('owner.listings.update', $listing), [
        'price' => '17.50',
        'description' => 'Description only for my shop',
        'is_active' => true,
    ])->assertRedirect(route('owner.listings.index'));

    expect($listing->fresh()->price)->toBe('17.50')
        ->and($listing->fresh()->description)->toBe('Description only for my shop')
        ->and($catalogProduct->fresh()->description)->not->toBe('Description only for my shop');
});

test('owners cannot manage a listing assigned to another shop', function () {
    $owner = User::factory()->create(['role' => 'shop_owner']);
    $otherOwner = User::factory()->create(['role' => 'shop_owner']);
    $otherShop = makeShop($otherOwner, 'Other shop');
    $product = makeProduct($owner);
    $listing = ShopProduct::create([
        'shop_id' => $otherShop->id,
        'product_id' => $product->id,
        'price' => 12,
        'is_active' => true,
    ]);

    $this->actingAs($owner)->get(route('owner.listings.edit', $listing))->assertNotFound();
    $this->delete(route('owner.listings.destroy', $listing))->assertNotFound();
});

test('storefront exposes only active products listed in the requested active shop', function () {
    $owner = User::factory()->create(['role' => 'shop_owner']);
    $shop = makeShop($owner, 'Public shop');
    $creator = User::factory()->create(['role' => 'admin']);
    $listedProduct = makeProduct($creator, 'Published');
    $unlistedProduct = makeProduct($creator, 'Not listed');
    $inactiveProduct = makeProduct($creator, 'Inactive global');
    $inactiveProduct->update(['is_active' => false]);

    $listing = ShopProduct::create([
        'shop_id' => $shop->id,
        'product_id' => $listedProduct->id,
        'price' => 8.50,
        'description' => 'Shop description',
        'is_active' => true,
    ]);
    ShopProduct::create([
        'shop_id' => $shop->id,
        'product_id' => $inactiveProduct->id,
        'price' => 1,
        'is_active' => true,
    ]);

    $response = $this->get(route('storefront.shop', $shop->slug))->assertOk();
    $response->assertSee($listedProduct->name)->assertDontSee($unlistedProduct->name)->assertDontSee($inactiveProduct->name);
    $this->get(route('storefront.product', [$shop->slug, $listedProduct->slug]))->assertOk()->assertSee('Shop description');
    $this->get(route('storefront.product', [$shop->slug, $unlistedProduct->slug]))->assertNotFound();

    $listing->update(['is_active' => false]);
    $this->get(route('storefront.product', [$shop->slug, $listedProduct->slug]))->assertNotFound();
});

test('guest checkout splits a multi-shop cart into orders using current listing prices', function () {
    $creator = User::factory()->create(['role' => 'admin']);
    $firstShop = makeShop(User::factory()->create(['role' => 'shop_owner']), 'First checkout shop');
    $secondShop = makeShop(User::factory()->create(['role' => 'shop_owner']), 'Second checkout shop');
    $firstProduct = makeProduct($creator, 'First checkout product');
    $secondProduct = makeProduct($creator, 'Second checkout product');
    $firstListing = ShopProduct::create([
        'shop_id' => $firstShop->id,
        'product_id' => $firstProduct->id,
        'price' => '17.50',
        'is_active' => true,
    ]);
    $secondListing = ShopProduct::create([
        'shop_id' => $secondShop->id,
        'product_id' => $secondProduct->id,
        'price' => '8.25',
        'is_active' => true,
    ]);

    $this->post(route('storefront.orders.store'), [
        'customer_name' => 'Cart Customer',
        'customer_phone' => '+1 555 0100',
        'delivery_address' => '42 Market Street',
        'items' => [
            ['listing_id' => $firstListing->id, 'quantity' => 2, 'price' => '0.01'],
            ['listing_id' => $secondListing->id, 'quantity' => 3, 'price' => '0.01'],
        ],
    ])->assertRedirect(route('storefront.order-confirmation'));

    $orders = Order::with('items')->orderBy('shop_id')->get();
    expect($orders)->toHaveCount(2)
        ->and($orders[0]->shop_id)->toBe($firstShop->id)
        ->and($orders[0]->subtotal)->toBe('35.00')
        ->and($orders[0]->items[0]->unit_price)->toBe('17.50')
        ->and($orders[0]->items[0]->quantity)->toBe(2)
        ->and($orders[1]->shop_id)->toBe($secondShop->id)
        ->and($orders[1]->subtotal)->toBe('24.75')
        ->and($orders[1]->items[0]->unit_price)->toBe('8.25');

    $this->get(route('storefront.order-confirmation'))->assertOk()
        ->assertInertia(fn ($page) => $page->component('storefront/order-confirmation')->has('orders', 2));
});

test('checkout rejects inactive products and shop owners cannot access or change other shop orders', function () {
    $creator = User::factory()->create(['role' => 'admin']);
    $owner = User::factory()->create(['role' => 'shop_owner']);
    $ownerShop = makeShop($owner, 'Owner order shop');
    $otherShop = makeShop(User::factory()->create(['role' => 'shop_owner']), 'Another order shop');
    $product = makeProduct($creator, 'Order test product');
    $listing = ShopProduct::create([
        'shop_id' => $otherShop->id,
        'product_id' => $product->id,
        'price' => '12.00',
        'is_active' => true,
    ]);

    $payload = [
        'customer_name' => 'Cart Customer',
        'customer_phone' => '555-1234',
        'delivery_address' => '42 Market Street',
        'items' => [['listing_id' => $listing->id, 'quantity' => 1]],
    ];
    $this->post(route('storefront.orders.store'), $payload)->assertRedirect(route('storefront.order-confirmation'));
    $order = Order::firstOrFail();

    $this->actingAs($owner)->get(route('owner.orders.index'))->assertOk()->assertDontSee($order->order_number);
    $this->patch(route('owner.orders.update', $order), ['status' => 'processing'])->assertNotFound();

    $listing->update(['is_active' => false]);
    $this->post(route('storefront.orders.store'), $payload)->assertSessionHasErrors('items');
    expect($ownerShop->orders()->count())->toBe(0);
});

test('shop owners can advance orders through valid status transitions only', function () {
    $owner = User::factory()->create(['role' => 'shop_owner']);
    $shop = makeShop($owner, 'Status order shop');
    $order = Order::create([
        'order_number' => 'ORD-STATUS-TEST',
        'shop_id' => $shop->id,
        'shop_name' => $shop->name,
        'customer_name' => 'Customer',
        'customer_phone' => '555-1234',
        'delivery_address' => '42 Market Street',
        'payment_method' => 'cash_on_delivery',
        'status' => 'pending',
        'subtotal' => '20.00',
    ]);

    $this->actingAs($owner)->patch(route('owner.orders.update', $order), ['status' => 'shipped'])
        ->assertSessionHasErrors('status');
    $this->patch(route('owner.orders.update', $order), ['status' => 'processing'])->assertRedirect();
    expect($order->fresh()->status)->toBe('processing');
});
