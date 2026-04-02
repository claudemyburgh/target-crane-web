<?php

use App\Http\Controllers\User\UserTrailerReportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:user'])->prefix('user')->as('user.')->group(function () {
    Route::get('trailer-reports', [UserTrailerReportController::class, 'index'])->name('trailer-reports.index');
    Route::get('trailer-reports/pdf/{trailerLoadedReport?}', [UserTrailerReportController::class, 'pdf'])->name('trailer-reports.single-pdf');
    Route::get('trailer-reports/pdf', [UserTrailerReportController::class, 'pdfRange'])->name('trailer-reports.pdf');
    Route::get('trailer-reports/{trailerLoadedReport}', [UserTrailerReportController::class, 'show'])->name('trailer-reports.show');
    Route::get('trailer-reports/{trailerLoadedReport}/pdf', [UserTrailerReportController::class, 'pdf'])->name('trailer-reports.single-pdf-legacy');
    Route::get('trailer-reports/{trailerLoadedReport}/excel', [UserTrailerReportController::class, 'excel'])->name('trailer-reports.excel');
    Route::post('trailer-reports/{trailerLoadedReport}/email', [UserTrailerReportController::class, 'email'])->name('trailer-reports.email');
});
