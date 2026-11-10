<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ShopOwnerRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ShopOwnerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/owners/index', [
            'owners' => User::where('role', 'shop_owner')->with('shop:id,owner_id,name,status')
                ->latest()->paginate(15),
        ]);
    }

    public function create(): Response
    {
        return $this->form();
    }

    public function store(ShopOwnerRequest $request): RedirectResponse
    {
        $owner = User::create([
            ...$request->safe()->only(['name', 'email']),
            'password' => Hash::make($request->validated('password')),
            'role' => 'shop_owner',
        ]);

        return to_route('admin.owners.index')->with('success', "Shop owner {$owner->name} created.");
    }

    public function edit(User $owner): Response
    {
        abort_unless($owner->isShopOwner(), 404);

        return $this->form($owner);
    }

    public function update(ShopOwnerRequest $request, User $owner): RedirectResponse
    {
        abort_unless($owner->isShopOwner(), 404);
        $data = $request->safe()->only(['name', 'email']);
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->validated('password'));
        }
        $owner->update($data);

        return to_route('admin.owners.index')->with('success', 'Shop owner updated.');
    }

    public function destroy(User $owner): RedirectResponse
    {
        abort_unless($owner->isShopOwner(), 404);
        abort_if($owner->shop()->exists(), 422, 'Delete the owner’s shop before deleting this account.');
        abort_if($owner->createdProducts()->exists(), 422, 'Reassign or delete this owner’s catalog products before deleting the account.');
        $owner->delete();

        return back()->with('success', 'Shop owner deleted.');
    }

    private function form(?User $owner = null): Response
    {
        return Inertia::render('admin/owners/form', [
            'owner' => $owner?->only('id', 'name', 'email'),
        ]);
    }
}
