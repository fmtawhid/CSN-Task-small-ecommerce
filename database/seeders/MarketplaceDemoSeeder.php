<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MarketplaceDemoSeeder extends Seeder
{
    private const ADMIN_EMAIL = 'demo-admin@example.test';

    private const USER_EMAIL = 'demo-user@example.test';

    private const OWNER_PASSWORD = 'OwnerDemo123!';

    private const ADMIN_PASSWORD = 'AdminDemo123!';

    private const USER_PASSWORD = 'UserDemo123!';

    private const STORES = [
        [
            'owner' => 'Ayesha Rahman',
            'shop' => 'Ayesha Home & Living',
            'slug' => 'ayesha-home-living',
            'description' => 'Thoughtful home essentials for everyday living.',
            'products' => [
                ['name' => 'Woven Cotton Cushion Cover', 'price' => 18.50],
                ['name' => 'Handmade Ceramic Table Vase', 'price' => 24.00],
                ['name' => 'Natural Jute Storage Basket', 'price' => 16.75],
                ['name' => 'Soft Linen Table Runner', 'price' => 21.25],
            ],
        ],
        [
            'owner' => 'Tanvir Hasan',
            'shop' => 'Tanvir Tech Corner',
            'slug' => 'tanvir-tech-corner',
            'description' => 'Useful accessories and gadgets for work and play.',
            'products' => [
                ['name' => 'Wireless Bluetooth Earbuds', 'price' => 32.00],
                ['name' => 'Adjustable Aluminum Laptop Stand', 'price' => 27.50],
                ['name' => 'Braided USB-C Fast Charging Cable', 'price' => 9.99],
                ['name' => 'Compact Wireless Mouse', 'price' => 18.25],
            ],
        ],
        [
            'owner' => 'Nusrat Jahan',
            'shop' => 'Nusrat Style Studio',
            'slug' => 'nusrat-style-studio',
            'description' => 'Everyday fashion and accessories with a personal touch.',
            'products' => [
                ['name' => 'Handloom Cotton Scarf', 'price' => 14.50],
                ['name' => 'Classic Canvas Shoulder Bag', 'price' => 29.00],
                ['name' => 'Minimalist Stainless Steel Bracelet', 'price' => 19.75],
                ['name' => 'Everyday Leather Card Holder', 'price' => 22.00],
            ],
        ],
        [
            'owner' => 'Farhan Ahmed',
            'shop' => 'Farhan Outdoor Goods',
            'slug' => 'farhan-outdoor-goods',
            'description' => 'Practical gear for weekend trips and outdoor adventures.',
            'products' => [
                ['name' => 'Stainless Steel Travel Water Bottle', 'price' => 17.50],
                ['name' => 'Lightweight Packable Daypack', 'price' => 34.00],
                ['name' => 'Rechargeable Mini Camping Lantern', 'price' => 23.25],
                ['name' => 'Insulated Picnic Cooler Bag', 'price' => 28.50],
            ],
        ],
        [
            'owner' => 'Maliha Chowdhury',
            'shop' => 'Maliha Books & Gifts',
            'slug' => 'maliha-books-gifts',
            'description' => 'Journals, stationery, and small gifts for curious minds.',
            'products' => [
                ['name' => 'Recycled Paper Daily Journal', 'price' => 12.00],
                ['name' => 'Hardcover Weekly Planner', 'price' => 15.75],
                ['name' => 'Watercolor Pocket Sketchbook', 'price' => 13.50],
                ['name' => 'Gift Box Colored Pencil Set', 'price' => 20.00],
            ],
        ],
    ];

    public function run(): void
    {
        DB::transaction(function () {
            $admin = User::updateOrCreate(
                ['email' => self::ADMIN_EMAIL],
                [
                    'name' => 'Marketplace Demo Admin',
                    'password' => self::ADMIN_PASSWORD,
                    'role' => 'admin',
                    'email_verified_at' => now(),
                ]
            );
            $admin->syncRoles(['admin']);

            User::updateOrCreate(
                ['email' => self::USER_EMAIL],
                [
                    'name' => 'Marketplace Demo User',
                    'password' => self::USER_PASSWORD,
                    'role' => 'user',
                    'email_verified_at' => now(),
                ]
            );

            foreach (self::STORES as $storeIndex => $storeData) {
                $owner = User::updateOrCreate(
                    ['email' => 'demo-owner-'.($storeIndex + 1).'@example.test'],
                    [
                        'name' => $storeData['owner'],
                        'password' => self::OWNER_PASSWORD,
                        'role' => 'shop_owner',
                        'email_verified_at' => now(),
                    ]
                );
                $owner->syncRoles(['shop_owner']);

                $shop = Shop::updateOrCreate(
                    ['slug' => $storeData['slug']],
                    [
                        'owner_id' => $owner->id,
                        'name' => $storeData['shop'],
                        'description' => $storeData['description'],
                        'status' => 'active',
                    ]
                );

                foreach ($storeData['products'] as $productData) {
                    $productSlug = Str::slug($productData['name']);
                    $product = Product::updateOrCreate(
                        ['slug' => $productSlug],
                        [
                            'created_by' => $owner->id,
                            'name' => $productData['name'],
                            'description' => $productData['name'].' selected for the '.$storeData['shop'].' collection.',
                            'is_active' => true,
                        ]
                    );

                    ShopProduct::updateOrCreate(
                        ['shop_id' => $shop->id, 'product_id' => $product->id],
                        [
                            'price' => $productData['price'],
                            'description' => $productData['name'].' — available from '.$storeData['shop'].'.',
                            'is_active' => true,
                        ]
                    );
                }
            }
        });

        $this->command?->info('Created 1 admin, 1 user, 5 shop owners, 5 shops, 20 unique products, and 20 shop listings.');
        $this->command?->info('Local demo credentials are listed in the README.');
    }
}
