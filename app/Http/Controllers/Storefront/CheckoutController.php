<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\PlaceOrderRequest;
use App\Models\Order;
use App\Models\ShopProduct;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('storefront/cart');
    }

    public function store(PlaceOrderRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $quantities = collect($data['items'])->mapWithKeys(
            fn (array $item): array => [(int) $item['listing_id'] => (int) $item['quantity']]
        );

        $orderSummaries = DB::transaction(function () use ($request, $data, $quantities): array {
            $listings = ShopProduct::query()
                ->whereKey($quantities->keys())
                ->where('is_active', true)
                ->whereHas('shop', fn (Builder $shop) => $shop->where('status', 'active'))
                ->whereHas('product', fn (Builder $product) => $product->where('is_active', true))
                ->with(['shop:id,name', 'product:id,name'])
                ->orderBy('shop_id')
                ->orderBy('id')
                ->lockForUpdate()
                ->get();

            if ($listings->count() !== $quantities->count()) {
                throw ValidationException::withMessages([
                    'items' => 'One or more products are no longer available. Review your cart and try again.',
                ]);
            }

            return $listings->groupBy('shop_id')->map(function (Collection $shopListings) use ($request, $data, $quantities): array {
                $shop = $shopListings->first()->shop;
                $subtotalCents = 0;
                $lineItems = $shopListings->map(function (ShopProduct $listing) use ($quantities, &$subtotalCents): array {
                    $quantity = $quantities->get($listing->id);
                    $unitPriceCents = self::toCents($listing->price);
                    $lineTotalCents = $unitPriceCents * $quantity;
                    $subtotalCents += $lineTotalCents;

                    return [
                        'shop_product_id' => $listing->id,
                        'product_id' => $listing->product_id,
                        'product_name' => $listing->product->name,
                        'unit_price' => self::fromCents($unitPriceCents),
                        'quantity' => $quantity,
                        'line_total' => self::fromCents($lineTotalCents),
                    ];
                });

                $order = Order::create([
                    'order_number' => 'ORD-'.Str::upper(Str::random(12)),
                    'shop_id' => $shop->id,
                    'shop_name' => $shop->name,
                    'customer_id' => $request->user()?->id,
                    'customer_name' => $data['customer_name'],
                    'customer_phone' => $data['customer_phone'],
                    'customer_email' => $data['customer_email'] ?? null,
                    'delivery_address' => $data['delivery_address'],
                    'customer_notes' => $data['customer_notes'] ?? null,
                    'payment_method' => 'cash_on_delivery',
                    'status' => 'pending',
                    'subtotal' => self::fromCents($subtotalCents),
                ]);
                $order->items()->createMany($lineItems->all());

                return [
                    'order_number' => $order->order_number,
                    'shop_name' => $shop->name,
                    'subtotal' => $order->subtotal,
                ];
            })->values()->all();
        });

        return to_route('storefront.order-confirmation')->with('checkout_orders', $orderSummaries);
    }

    public function confirmation(): Response
    {
        $orders = request()->session()->pull('checkout_orders', []);
        abort_if($orders === [], 404);

        return Inertia::render('storefront/order-confirmation', [
            'orders' => $orders,
        ]);
    }

    private static function toCents(string|int|float $amount): int
    {
        $parts = explode('.', (string) $amount, 2);

        return ((int) $parts[0] * 100) + (int) str_pad(substr($parts[1] ?? '', 0, 2), 2, '0');
    }

    private static function fromCents(int $cents): string
    {
        return intdiv($cents, 100).'.'.str_pad((string) ($cents % 100), 2, '0', STR_PAD_LEFT);
    }
}
