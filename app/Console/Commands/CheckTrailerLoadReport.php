<?php

namespace App\Console\Commands;

use App\Models\TrailerLoadedReport;
use Illuminate\Console\Command;

class CheckTrailerLoadReport extends Command
{
    protected $signature = 'trailer-load-report:check';

    protected $description = 'Check and duplicate trailer load report if not exists for today';

    public function handle(): int
    {
        $today = now()->startOfDay();

        if (TrailerLoadedReport::whereDate('date', $today)->exists()) {
            return Command::SUCCESS;
        }

        $lastReport = TrailerLoadedReport::whereDate('date', '<', $today)
            ->orderByDesc('date')
            ->first();

        if (! $lastReport) {
            $this->warn('No previous report found to duplicate.');

            return Command::SUCCESS;
        }

        TrailerLoadedReport::create([
            'date' => $today,
            'loads' => $lastReport->loads,
        ]);

        $this->info('Created report for today by duplicating previous report.');

        return Command::SUCCESS;
    }
}
