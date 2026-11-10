<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class MarketplaceDemoSeeder extends Seeder
{
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
        $credentials = [];

        DB::transaction(function () use (&$credentials) {
            $adminPassword = Str::random(24);
            $admin = User::updateOrCreate(
                ['email' => 'marketplace-demo-admin@example.test'],
                [
                    'name' => 'Marketplace Demo Admin',
                    'password' => $adminPassword,
                    'role' => 'admin',
                    'email_verified_at' => now(),
                ]
            );
            $admin->syncRoles(['admin']);
            $credentials[] = ['role' => 'Admin', 'user' => $admin, 'password' => $adminPassword];

            foreach (self::STORES as $storeIndex => $storeData) {
                $ownerPassword = Str::random(24);
                $owner = User::updateOrCreate(
                    ['email' => 'marketplace-demo-owner-'.($storeIndex + 1).'@example.test'],
                    [
                        'name' => $storeData['owner'],
                        'password' => $ownerPassword,
                        'role' => 'shop_owner',
                        'email_verified_at' => now(),
                    ]
                );
                $owner->syncRoles(['shop_owner']);
                $credentials[] = ['role' => 'Shop Owner', 'user' => $owner, 'password' => $ownerPassword];

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

        $lines = [
            'LOCAL DEMO MARKETPLACE LOGIN CREDENTIALS',
            '=========================================',
            'For local development only. Do not use these accounts in production.',
            'Credentials are regenerated whenever MarketplaceDemoSeeder runs.',
            '',
        ];

        foreach ($credentials as $credential) {
            $user = $credential['user'];
            $lines[] = $credential['role'];
            $lines[] = 'Name: '.$user->name;
            $lines[] = 'User ID: '.$user->id;
            $lines[] = 'Email / login ID: '.$user->email;
            $lines[] = 'Password: '.$credential['password'];
            $lines[] = '';
        }

        if (! Storage::disk('local')->put('demo-credentials.txt', implode(PHP_EOL, $lines))) {
            throw new RuntimeException('Demo accounts were created, but the local credentials file could not be written.');
        }

        $this->command?->info('Created 1 admin, 5 shop owners, 5 shops, 20 unique products, and 20 shop listings.');
        $this->command?->info('Local credentials saved to storage/app/private/demo-credentials.txt (git-ignored).');
    }
}
