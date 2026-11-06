<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $adminPassword = env('SEED_ADMIN_PASSWORD');
        $userPassword = env('SEED_USER_PASSWORD');

        if (! $adminPassword || ! $userPassword) {
            throw new \RuntimeException('Set SEED_ADMIN_PASSWORD and SEED_USER_PASSWORD in .env before seeding.');
        }

        User::create([
            'name' => 'Admin',
            'email' => 'admin@email.com',
            'password' => Hash::make($adminPassword),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Regular User',
            'email' => 'user@email.com',
            'password' => Hash::make($userPassword),
            'role' => 'user',
        ]);
    }
}