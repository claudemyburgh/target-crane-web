<?php

use App\Models\Trailer;
use App\Models\TrailerLoadedReport;
use App\Models\User;
use Illuminate\Support\Facades\DB;

test('check query count', function () {
    $user = User::factory()->create();
    $user->assignRole('admin'); // Assuming spatie permissions

    Trailer::factory()->count(10)->create();
    TrailerLoadedReport::factory()->create(['date' => now()]);

    DB::enableQueryLog();

    $response = $this->actingAs($user)->get(route('admin.trailer-loaded-reports.create'));

    $response->assertOk();

    dd(count(DB::getQueryLog()), DB::getQueryLog());
});
