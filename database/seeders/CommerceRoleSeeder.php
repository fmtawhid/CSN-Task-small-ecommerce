<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CommerceRoleSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['admin', 'shop_owner'] as $name) {
            Role::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        Role::findByName('admin')->syncPermissions(Permission::all());
    }
}
