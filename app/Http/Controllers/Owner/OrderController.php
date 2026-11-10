<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Owner\UpdateOrderStatusRequest;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    private const TRANSITIONS = [
        'pending' => ['processing', 'cancelled'],
        'processing' => ['shipped', 'cancelled'],
        'shipped' => ['delivered'],
        'delivered' => [],
        'cancelled' => [],
    ];

    public function index(): Response
    {
        $shop = request()->user()->shop;
        abort_unless($shop, 403, 'A shop must be assigned to your account before managing orders.');

        $orders = $shop->orders()
            ->with('items:id,order_id,product_name,unit_price,quantity,line_total')
            ->latest()
            ->paginate(15)
            ->through(function (Order $order): array {
                return [
                    ...$order->toArray(),
                    'available_statuses' => self::TRANSITIONS[$order->status] ?? [],
                ];
            });

        return Inertia::render('owner/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function update(UpdateOrderStatusRequest $request, Order $order): RedirectResponse
    {
        $shop = $request->user()->shop;
        abort_unless($shop, 403);
        $status = $request->validated('status');

        DB::transaction(function () use ($shop, $order, $status): void {
            $currentOrder = $shop->orders()->whereKey($order->id)->lockForUpdate()->firstOrFail();

            if (! in_array($status, self::TRANSITIONS[$currentOrder->status] ?? [], true)) {
                throw ValidationException::withMessages([
                    'status' => 'That order status transition is not allowed.',
                ]);
            }

            $currentOrder->update(['status' => $status]);
        });

        return back()->with('success', 'Order status updated.');
    }
}
