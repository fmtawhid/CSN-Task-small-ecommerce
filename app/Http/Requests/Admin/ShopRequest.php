<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ShopRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        $shop = $this->route('shop');

        return [
            'owner_id' => $shop
                ? ['required', 'integer', Rule::exists('users', 'id')->where('role', 'shop_owner'),
                    Rule::unique('shops', 'owner_id')->ignore($shop->id)]
                : ['prohibited'],
            'owner_name' => $shop ? ['prohibited'] : ['required', 'string', 'max:255'],
            'owner_email' => $shop ? ['prohibited'] : ['required', 'email', 'max:255', 'unique:users,email'],
            'owner_password' => $shop ? ['prohibited'] : ['required', 'string', 'min:8', 'confirmed'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('shops', 'slug')->ignore($shop?->id)],
            'description' => ['nullable', 'string', 'max:5000'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }
}
