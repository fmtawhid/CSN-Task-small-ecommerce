<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('shop_owner')->index();
        });

        if (Schema::hasTable('model_has_roles') && Schema::hasTable('roles')) {
            $adminIds = DB::table('model_has_roles')
                ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
                ->where('model_has_roles.model_type', \App\Models\User::class)
                ->whereIn('roles.name', ['admin', 'Admin', 'Super Admin'])
                ->pluck('model_has_roles.model_id');

            DB::table('users')->whereIn('id', $adminIds)->update(['role' => 'admin']);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropColumn('role');
        });
    }
};
