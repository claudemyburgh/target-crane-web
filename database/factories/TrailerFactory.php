<?php

namespace Database\Factories;

use App\Models\Trailer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Trailer>
 */
class TrailerFactory extends Factory
{
    protected $counter = 1;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $brands = ['Volvo', 'Scania', 'MAN', 'Mercedes-Benz', 'DAF', 'Iveco'];

        return [
            'fleet_number' => 'T'.str_pad((string) $this->counter++, 2, '0', STR_PAD_LEFT),
            'registration_number' => 'CA'.rand(10000, 99999),
            'brand_name' => fake()->randomElement($brands),
            'axles_amount' => fake()->randomElement([2, 3]),
            'license_expiry_date' => now()->addDays(rand(30, 365)),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Trailer $trailer) {
            $this->counter = max($this->counter, (int) str_replace('T', '', $trailer->fleet_number) + 1);
        });
    }
}
