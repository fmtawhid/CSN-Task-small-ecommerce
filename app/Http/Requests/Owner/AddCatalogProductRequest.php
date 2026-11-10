<?php

namespace App\Http\Requests\Owner;

use Illuminate\Foundation\Http\FormRequest;

class AddCatalogProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isShopOwner() === true;
    }

    public function rules(): array
    {
        return [
            'price' => ['required', 'numeric', 'min:0.01', 'max:9999999999.99'],
        ];
    }
}
