<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class PublicImageUploader
{
    public static function store(?UploadedFile $file, string $directory, string $errorField = 'thumbnail'): ?string
    {
        if ($file === null) {
            return null;
        }

        $realPath = $file->getRealPath();

        if (! $file->isValid() || ! is_string($realPath) || $realPath === '' || ! is_file($realPath)) {
            throw ValidationException::withMessages([
                $errorField => 'The uploaded image could not be read. Please choose the image again.',
            ]);
        }

        $path = $file->store($directory, 'public');

        if (! is_string($path) || $path === '') {
            throw new RuntimeException('The image could not be saved to public storage.');
        }

        return $path;
    }

    public static function delete(?string $path): void
    {
        if ($path !== null && $path !== '') {
            Storage::disk('public')->delete($path);
        }
    }
}
