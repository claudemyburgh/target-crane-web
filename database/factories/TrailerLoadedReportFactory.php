<?php

namespace Database\Factories;

use App\Models\Trailer;
use App\Models\TrailerLoadedReport;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Collection;

/**
 * @extends Factory<TrailerLoadedReport>
 */
class TrailerLoadedReportFactory extends Factory
{
    protected static ?Collection $trailers = null;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        if (self::$trailers === null) {
            self::$trailers = Trailer::all();
        }

        if (self::$trailers->isEmpty()) {
            return [
                'date' => fake()->date(),
                'loads' => [],
            ];
        }

        $locations = ['Depot A', 'Depot B', 'Warehouse 1', 'Warehouse 2', 'Loading Bay'];

        $loads = [];

        foreach (self::$trailers as $trailer) {
            $loads[] = [
                'fleet_number' => $trailer->fleet_number,
                'registration_number' => $trailer->registration_number,
                'loaded' => (bool) rand(0, 1),
                'location' => $locations[array_rand($locations)],
                'comment' => '',
            ];
        }

        return [
            'date' => fake()->date(),
            'loads' => $loads,
        ];
    }
}
