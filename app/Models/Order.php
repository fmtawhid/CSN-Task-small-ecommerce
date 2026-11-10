<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    public const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    protected $fillable = [
        'order_number',
        'shop_id',
        'shop_name',
        'customer_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'delivery_address',
        'customer_notes',
        'payment_method',
        'status',
        'subtotal',
    ];

    protected function casts(): array
    {
        return ['subtotal' => 'decimal:2'];
    }

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
