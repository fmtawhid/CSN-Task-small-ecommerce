<?php

namespace Database\Seeders;

use App\Models\HomepageSlide;
use Illuminate\Database\Seeder;

class HomepageContentSeeder extends Seeder
{
    public function run(): void
    {
        if (HomepageSlide::query()->exists()) {
            return;
        }

        HomepageSlide::insert([
            [
                'title' => 'Good finds from shops worth knowing.',
                'subtitle' => 'Explore thoughtfully picked products from independent sellers, all in one welcoming marketplace.',
                'image' => '/images/marketplace-banner-1.svg',
                'button_text' => 'Explore products',
                'button_url' => '/products',
                'sort_order' => 0,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Find your next favorite, all in one place.',
                'subtitle' => 'Meet independent shops, discover their collections, and find something made for you.',
                'image' => '/images/marketplace-banner-2.svg',
                'button_text' => 'Browse all shops',
                'button_url' => '/stores',
                'sort_order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
