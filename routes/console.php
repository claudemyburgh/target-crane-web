<?php

use App\Console\Commands\CheckTrailerLoadReport;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command(CheckTrailerLoadReport::class)->everyFifteenMinutes();  //->dailyAt('17:00');

