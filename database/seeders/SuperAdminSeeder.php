<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use InvalidArgumentException;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $email = config('ecommerce.admin_email');
        $password = config('ecommerce.admin_password');

        if (! $email || ! $password) {
            throw new InvalidArgumentException(
                'Set ECOMMERCE_ADMIN_EMAIL and ECOMMERCE_ADMIN_PASSWORD before seeding the initial administrator.'
            );
        }

        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => config('ecommerce.admin_name'),
                'password' => Hash::make($password),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        if (! $user->isAdmin()) {
            throw new InvalidArgumentException('The configured administrator email already belongs to a non-admin account.');
        }

        $user->assignRole('admin');
    }
}
