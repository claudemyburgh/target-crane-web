<?php

use App\Http\Controllers\Frontend\HomeIndexController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeIndexController::class)->name('home');

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
require __DIR__.'/dashboard.php';
require __DIR__.'/user.php';
