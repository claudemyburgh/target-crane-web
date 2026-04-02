<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $users = [
            [
                'name' => 'Claude Myburgh',
                'email' => 'claude@designbycode.co.za',
                'password' => 'password',
            ],
            [
                'name' => 'Pam',
                'email' => 'pam@teemanecranes.co.za',
                'password' => 'password',
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
