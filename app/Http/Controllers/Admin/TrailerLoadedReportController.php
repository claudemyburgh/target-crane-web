<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TrailerLoadedReportFormRequest;
use App\Models\TrailerLoadedReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class TrailerLoadedReportController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', TrailerLoadedReport::class);

        $perPage = $request->integer('per_page', 25);

        $reports = QueryBuilder::for(TrailerLoadedReport::class)
            ->allowedFilters([
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->whereRaw("JSON_SEARCH(loads, 'one', ?, NULL, '$[*].fleet_number') IS NOT NULL", ["%$value%"])
                            ->orWhereRaw("JSON_SEARCH(loads, 'one', ?, NULL, '$[*].registration_number') IS NOT NULL", ["%$value%"]);
                    });
                }),
                AllowedFilter::callback('date', function ($query, $value) {
                    $query->whereDate('date', $value);
                }),
            ])
            ->allowedSorts(['date', 'created_at'])
            ->defaultSort('-date')
            ->paginate($perPage)
            ->onEachSide(3)
            ->withQueryString();

        $isAdmin = $request->user()->hasRole('admin');

        return Inertia::render('admin/trailer-loaded-reports/index', [
            'reports' => $reports,
            'filters' => [
                'search' => $request->string('search', ''),
                'date' => $request->string('date', ''),
                'sort' => $request->string('sort', 'date'),
                'direction' => $request->string('direction', 'desc'),
                'per_page' => $perPage,
                'page' => $request->integer('page', 1),
            ],
            'can' => [
                'create' => $isAdmin,
            ],
        ]);
    }

    public function create(Request $request)
    {
        $this->authorize('create', TrailerLoadedReport::class);

        return Inertia::render('admin/trailer-loaded-reports/create');
    }

    public function store(TrailerLoadedReportFormRequest $request)
    {
        $this->authorize('create', TrailerLoadedReport::class);

        TrailerLoadedReport::create($request->validated());

        return to_route('admin.trailer-loaded-reports.index');
    }

    public function destroy(Request $request, TrailerLoadedReport $trailerLoadedReport)
    {
        $this->authorize('delete', $trailerLoadedReport);

        $trailerLoadedReport->delete();

        return to_route('admin.trailer-loaded-reports.index');
    }
}
