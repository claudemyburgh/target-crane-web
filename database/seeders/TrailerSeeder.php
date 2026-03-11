<?php

namespace Database\Seeders;

use App\Models\Trailer;
use Illuminate\Database\Seeder;

class TrailerSeeder extends Seeder
{
    public function run(): void
    {
        $brands = ['Volvo', 'Scania', 'MAN', 'Mercedes-Benz', 'DAF', 'Iveco'];

        $trailers = [
            ['fleet_number' => 'T01', 'registration_number' => 'CA10001', 'brand_name' => 'Volvo', 'axles_amount' => 2],
            ['fleet_number' => 'T02', 'registration_number' => 'CA10002', 'brand_name' => 'Scania', 'axles_amount' => 2],
            ['fleet_number' => 'T03', 'registration_number' => 'CA10003', 'brand_name' => 'MAN', 'axles_amount' => 3],
            ['fleet_number' => 'T04', 'registration_number' => 'CA10004', 'brand_name' => 'Mercedes-Benz', 'axles_amount' => 2],
            ['fleet_number' => 'T05', 'registration_number' => 'CA10005', 'brand_name' => 'DAF', 'axles_amount' => 2],
            ['fleet_number' => 'T06', 'registration_number' => 'CA10006', 'brand_name' => 'Iveco', 'axles_amount' => 3],
            ['fleet_number' => 'T07', 'registration_number' => 'CA10007', 'brand_name' => 'Volvo', 'axles_amount' => 3],
            ['fleet_number' => 'T08', 'registration_number' => 'CA10008', 'brand_name' => 'Scania', 'axles_amount' => 2],
        ];

        foreach ($trailers as $trailer) {
            $trailer['license_expiry_date'] = now()->addDays(rand(1, 365));
            Trailer::create($trailer);
        }
    }
}
