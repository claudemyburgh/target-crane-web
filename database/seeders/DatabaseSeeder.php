<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions first
        $this->call(RolesAndPermissionsSeeder::class);

        // Create admin user
        $admin = User::factory()->create([
            'name' => 'Claude Myburgh',
            'email' => 'claude@designbycode.co.za',
        ]);
        $admin->assignRole('admin');

        // Create moderator user
        $moderator = User::factory()->create([
            'name' => 'Pam',
            'email' => 'pam@teemanecranes.co.za',
        ]);
        $moderator->assignRole('moderator');

        // Create regular test user
        //        $user = User::factory()->create([
        //            'name' => 'Test User',
        //            'email' => 'test@example.com',
        //        ]);
        //        $user->assignRole('user');

        $this->call([
            //            UserSeeder::class,
            TrailerSeeder::class,
            TrailerLoadedReportSeeder::class,
        ]);
    }
}
