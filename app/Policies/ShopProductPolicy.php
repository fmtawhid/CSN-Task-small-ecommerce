<?php

namespace App\Policies;

use App\Models\ShopProduct;
use App\Models\User;

class ShopProductPolicy
{
    public function manage(User $user, ShopProduct $listing): bool
    {
        return $user->isAdmin()
            || ($user->isShopOwner() && $user->shop?->is($listing->shop));
    }
}
