<?php

namespace Database\Seeders;

use App\Models\Trailer;
use App\Models\TrailerLoadedReport;
use Illuminate\Database\Seeder;

class TrailerLoadedReportSeeder extends Seeder
{
    public function run(): void
    {
        $trailers = Trailer::all();

        if ($trailers->isEmpty()) {
            $this->command->warn('No trailers found. Please run TrailerSeeder first.');

            return;
        }

        TrailerLoadedReport::query()->delete();

        $startDate = now()->subMonths(6)->startOfDay();
        $endDate = now()->subDay()->startOfDay();
        $totalDays = $startDate->diffInDays($endDate);

        TrailerLoadedReport::factory()
            ->count($totalDays)
            ->sequence(fn ($sequence) => ['date' => $startDate->copy()->addDays($sequence->index)])
            ->create();

        TrailerLoadedReport::query()
            ->whereRaw('DAYOFWEEK(date) IN (1, 7)')
            ->delete();

        $count = TrailerLoadedReport::count();
        $this->command->info("Created {$count} trailer loaded reports.");
    }
}
