<?php

use App\Models\TrailerLoadedReport;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);

    $this->admin = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $this->admin->assignRole('admin');
    $this->actingAs($this->admin);
});

test('trailer loaded reports index route exists', function () {
    $response = $this->get('/admin/trailer-loaded-reports');
    expect($response->status())->toBe(200);
});

test('trailer loaded reports create route exists', function () {
    $response = $this->get('/admin/trailer-loaded-reports/create');
    expect($response->status())->toBe(200);
});

test('trailer loaded reports store route exists', function () {
    $response = $this->post('/admin/trailer-loaded-reports', [
        'date' => now()->format('Y-m-d'),
        'loads' => [
            ['fleet_number' => 'T1', 'registration_number' => 'R1', 'loaded' => 'Empty', 'location' => 'Location 1'],
        ],
    ]);

    expect($response->getStatusCode())->toBe(302);
});

test('trailer loaded reports show route exists', function () {
    $report = TrailerLoadedReport::create([
        'date' => now()->format('Y-m-d'),
        'loads' => [
            ['fleet_number' => 'T1', 'registration_number' => 'R1', 'loaded' => 'Empty', 'location' => 'Location 1'],
        ],
    ]);

    $response = $this->get("/admin/trailer-loaded-reports/{$report->date}");
    expect($response->status())->toBe(200);
});

test('trailer loaded reports edit route exists', function () {
    $report = TrailerLoadedReport::create([
        'date' => now()->format('Y-m-d'),
        'loads' => [
            ['fleet_number' => 'T1', 'registration_number' => 'R1', 'loaded' => 'Empty', 'location' => 'Location 1'],
        ],
    ]);

    $response = $this->get("/admin/trailer-loaded-reports/{$report->date}/edit");
    expect($response->status())->toBe(200);
});

test('trailer loaded reports update route exists', function () {
    $report = TrailerLoadedReport::create([
        'date' => now()->format('Y-m-d'),
        'loads' => [
            ['fleet_number' => 'T1', 'registration_number' => 'R1', 'loaded' => 'Empty', 'location' => 'Location 1'],
        ],
    ]);

    $response = $this->put("/admin/trailer-loaded-reports/{$report->date}", [
        'date' => now()->format('Y-m-d'),
        'loads' => [
            ['fleet_number' => 'T1', 'registration_number' => 'R1', 'loaded' => 'Loaded', 'location' => 'Location 1'],
        ],
    ]);

    expect($response->getStatusCode())->toBe(302);
});

test('trailer loaded reports delete route exists', function () {
    $report = TrailerLoadedReport::create([
        'date' => now()->format('Y-m-d'),
        'loads' => [
            ['fleet_number' => 'T1', 'registration_number' => 'R1', 'loaded' => 'Empty', 'location' => 'Location 1'],
        ],
    ]);

    $response = $this->delete("/admin/trailer-loaded-reports/{$report->date}");
    expect($response->getStatusCode())->toBe(302);
});
