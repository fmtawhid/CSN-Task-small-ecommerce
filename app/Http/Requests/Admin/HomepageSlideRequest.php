<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class HomepageSlideRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        $isUpdate = $this->route('slide') !== null;

        return [
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:1000'],
            'image' => [$isUpdate ? 'nullable' : 'required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'button_text' => ['nullable', 'string', 'max:60'],
            'button_url' => [
                'nullable',
                'string',
                'max:2048',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if ($value === null || (str_starts_with($value, '/') && ! str_starts_with($value, '//'))) {
                        return;
                    }

                    $scheme = filter_var($value, FILTER_VALIDATE_URL) ? parse_url($value, PHP_URL_SCHEME) : null;
                    if (! in_array($scheme, ['http', 'https'], true)) {
                        $fail('The button link must be an HTTP(S) URL or a path on this site.');
                    }
                },
            ],
            'sort_order' => ['required', 'integer', 'min:0', 'max:65535'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
