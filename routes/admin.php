<?php

use App\Http\Controllers\Admin\DashboardAdminController;
use App\Http\Controllers\Admin\ImpersonationController;
use App\Http\Controllers\Admin\TrailerController;
use App\Http\Controllers\Admin\UserAdminController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// Impersonation stop route - must be accessible when impersonating (user loses admin role)
Route::post('/admin/impersonate/stop', [ImpersonationController::class, 'stop'])
    ->name('admin.impersonate.stop')
    ->middleware(['auth', 'verified']);

Route::middleware(['auth', 'verified'])->prefix('admin')->as('admin.')->group(function () {
    Route::resource('trailers', TrailerController::class);
    Route::post('trailers/{trailer}/restore', [TrailerController::class, 'restore'])->name('trailers.restore');
    Route::delete('trailers/{trailer}/force-delete', [TrailerController::class, 'forceDelete'])->name('trailers.force-delete');
    Route::post('trailers/bulk', [TrailerController::class, 'bulk'])->name('trailers.bulk');
});

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->as('admin.')->group(function () {

    Route::get('/dashboard', DashboardAdminController::class)->name('dashboard');

    Route::resource('users', UserAdminController::class);
    Route::post('users/{user}/restore', [UserAdminController::class, 'restore'])->name('users.restore');
    Route::post('users/{user}/ban', [UserAdminController::class, 'ban'])->name('users.ban');
    Route::post('users/{user}/unban', [UserAdminController::class, 'unban'])->name('users.unban');
    Route::post('users/{user}/assign-role', [UserAdminController::class, 'assignRole'])->name('users.assign-role');
    Route::post('users/{user}/remove-role', [UserAdminController::class, 'removeRole'])->name('users.remove-role');

    // Avatar management for specific users (admin editing another user)
    Route::post('users/{user}/avatar', [UserAdminController::class, 'uploadAvatar'])->name('users.avatar.upload');
    Route::delete('users/{user}/avatar', [UserAdminController::class, 'deleteAvatar'])->name('users.avatar.delete');

    Route::post('users/bulk', [UserAdminController::class, 'bulk'])->name('users.bulk');

    Route::post('users/{user}/impersonate', [ImpersonationController::class, 'start'])->name('users.impersonate');
});
