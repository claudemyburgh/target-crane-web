<?php

use App\Http\Controllers\Dashboard\DashboardIndexController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardIndexController::class)->name('dashboard');
});
