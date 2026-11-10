<?php

namespace App\Policies;

use App\Models\Shop;
use App\Models\User;

class ShopPolicy
{
    public function manage(User $user, Shop $shop): bool
    {
        return $user->isAdmin() || ($user->isShopOwner() && $shop->owner_id === $user->id);
    }

    public function view(User $user, Shop $shop): bool
    {
        return $this->manage($user, $shop);
    }
}
