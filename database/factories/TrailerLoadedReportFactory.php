<?php

namespace Database\Factories;

use App\Enums\Location;
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

        $locations = Location::values();

        $loads = [];

        foreach (self::$trailers as $trailer) {
            $isLoaded = (bool) rand(0, 1);
            $loads[] = [
                'fleet_number' => $trailer->fleet_number,
                'registration_number' => $trailer->registration_number,
                'loaded' => $isLoaded ? fake()->randomElement(['Boat '.fake()->unique()->numerify('C####'), fake()->randomElement(['C1 desk lid mould', 'C2 desk lid mould', 'C3 desk lid mould'])]) : '',
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
