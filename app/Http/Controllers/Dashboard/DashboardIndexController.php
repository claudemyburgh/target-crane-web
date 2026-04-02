<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\TrailerLoadedReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardIndexController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $latestReport = TrailerLoadedReport::latest('date')->first();

        return Inertia::render('dashboard/index', [
            'latestReport' => $latestReport,
        ]);
    }
}
