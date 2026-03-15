<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TrailerLoadedReportFormRequest;
use App\Mail\TrailerLoadedReportMail;
use App\Models\Trailer;
use App\Models\TrailerLoadedReport;
use App\Models\User;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Spatie\LaravelPdf\Facades\Pdf;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\SimpleExcel\SimpleExcelWriter;

class TrailerLoadedReportController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', TrailerLoadedReport::class);

        $perPage = $request->integer('per_page', 25);

        $reports = QueryBuilder::for(TrailerLoadedReport::class)
            ->orderBy('date', 'desc')
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

        $trailers = Trailer::orderBy('fleet_number')->get(['id', 'fleet_number', 'registration_number']);

        return Inertia::render('admin/trailer-loaded-reports/create', [
            'trailers' => $trailers,
        ]);
    }

    public function store(TrailerLoadedReportFormRequest $request)
    {
        $this->authorize('create', TrailerLoadedReport::class);

        $exists = TrailerLoadedReport::whereDate('date', $request->date)->exists();
        if ($exists) {
            return back()->withErrors(['date' => 'A report already exists for this date.'])->withInput();
        }

        TrailerLoadedReport::create($request->validated());

        return to_route('admin.trailer-loaded-reports.index');
    }

    public function edit(Request $request, TrailerLoadedReport $trailerLoadedReport)
    {
        $this->authorize('update', $trailerLoadedReport);

        $trailers = Trailer::orderBy('fleet_number')->get(['id', 'fleet_number', 'registration_number']);

        return Inertia::render('admin/trailer-loaded-reports/edit', [
            'report' => [
                'id' => $trailerLoadedReport->id,
                'date' => $trailerLoadedReport->date->format('Y-m-d'),
                'loads' => $trailerLoadedReport->loads,
            ],
            'trailers' => $trailers,
        ]);
    }

    public function update(TrailerLoadedReportFormRequest $request, TrailerLoadedReport $trailerLoadedReport)
    {
        $this->authorize('update', $trailerLoadedReport);

        $reportId = $trailerLoadedReport->id;
        $exists = TrailerLoadedReport::whereDate('date', $request->date)
            ->where('id', '!=', $reportId)
            ->exists();
        if ($exists) {
            return back()->withErrors(['date' => 'A report already exists for this date.'])->withInput();
        }

        $trailerLoadedReport->update($request->validated());

        return back();
    }

    public function show(Request $request, TrailerLoadedReport $trailerLoadedReport)
    {
        $this->authorize('view', $trailerLoadedReport);

        $users = User::orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('admin/trailer-loaded-reports/show', [
            'report' => [
                'id' => $trailerLoadedReport->id,
                'date' => $trailerLoadedReport->date->format('Y-m-d'),
                'loads' => $trailerLoadedReport->loads,
                'created_at' => $trailerLoadedReport->created_at->toIsoString(),
            ],
            'users' => $users,
        ]);
    }

    public function pdfRange(Request $request)
    {
        $days = $request->integer('days', 7);

        if (! in_array($days, [7, 14, 30])) {
            $days = 7;
        }

        return $this->generateRangePdf($days);
    }

    public function pdf(Request $request, ?TrailerLoadedReport $trailerLoadedReport = null)
    {
        if ($trailerLoadedReport) {
            return $this->generateSingleDayPdf($trailerLoadedReport);
        }

        return $this->pdfRange($request);
    }

    public function excel(Request $request, TrailerLoadedReport $trailerLoadedReport)
    {
        $this->authorize('view', $trailerLoadedReport);

        $trailers = Trailer::orderBy('fleet_number')->get();

        $loadsByFleet = [];
        foreach ($trailerLoadedReport->loads as $load) {
            $loadsByFleet[$load['fleet_number']] = $load;
        }

        $reportData = $trailers->map(function ($trailer) use ($loadsByFleet) {
            $load = $loadsByFleet[$trailer->fleet_number] ?? null;

            return [
                'fleet_number' => $trailer->fleet_number,
                'registration_number' => $trailer->registration_number,
                'status' => $load['loaded'] ?: 'Empty',
                'location' => $load['location'] ?? '',
                'comment' => $load['comment'] ?? '',
            ];
        });

        $fileName = 'trailer-report-'.$trailerLoadedReport->date->format('Y-m-d').'.xlsx';

        return response()->streamDownload(function () use ($reportData) {
            $writer = SimpleExcelWriter::createDownloadStream('xlsx');
            $writer->addRows($reportData->toArray());
            $writer->close();
        }, $fileName);
    }

    public function email(Request $request, TrailerLoadedReport $trailerLoadedReport)
    {
        $this->authorize('view', $trailerLoadedReport);

        $request->validate([
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'integer|exists:users,id',
        ]);

        $users = User::whereIn('id', $request->user_ids)->get();

        $pdfContent = $this->generateSingleDayPdfContent($trailerLoadedReport);

        foreach ($users as $user) {
            Mail::to($user->email)->send(new TrailerLoadedReportMail($trailerLoadedReport, $pdfContent));
        }

        return back()->with('success', 'Report sent to '.$users->count().' recipient(s).');
    }

    private function generateSingleDayPdfContent(TrailerLoadedReport $report)
    {
        $trailers = Trailer::orderBy('fleet_number')->get();

        $loadsByFleet = [];
        foreach ($report->loads as $load) {
            $loadsByFleet[$load['fleet_number']] = $load;
        }

        $reportData = $trailers->map(function ($trailer) use ($loadsByFleet) {
            $load = $loadsByFleet[$trailer->fleet_number] ?? null;

            return [
                'fleet_number' => $trailer->fleet_number,
                'registration_number' => $trailer->registration_number,
                'loaded' => $load['loaded'] ?: 'Empty',
                'location' => $load['location'] ?? '',
                'comment' => $load['comment'] ?? '',
            ];
        });

        $loadedCount = $reportData->filter(fn ($t) => $t['loaded'] && $t['loaded'] !== 'Empty')->count();
        $emptyCount = $reportData->filter(fn ($t) => ! $t['loaded'] || $t['loaded'] === 'Empty')->count();

        $html = view('pdf.trailer-loaded-report', [
            'title' => 'Trailer Loaded Report',
            'dateRange' => $report->date->format('d M Y'),
            'endDate' => $report->date,
            'startDate' => $report->date,
            'trailers' => $reportData,
            'loadedCount' => $loadedCount,
            'emptyCount' => $emptyCount,
            'showDates' => false,
        ])->render();

        $options = new Options;
        $options->setIsRemoteEnabled(true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return $dompdf->output();
    }

    private function generateSingleDayPdf(TrailerLoadedReport $report)
    {
        $this->authorize('view', $report);

        $trailers = Trailer::orderBy('fleet_number')->get();

        $loadsByFleet = [];
        foreach ($report->loads as $load) {
            $loadsByFleet[$load['fleet_number']] = $load;
        }

        $reportData = $trailers->map(function ($trailer) use ($loadsByFleet) {
            $load = $loadsByFleet[$trailer->fleet_number] ?? null;

            return [
                'fleet_number' => $trailer->fleet_number,
                'registration_number' => $trailer->registration_number,
                'loaded' => $load['loaded'] ?: 'Empty',
                'location' => $load['location'] ?? '',
                'comment' => $load['comment'] ?? '',
            ];
        });

        $loadedCount = $reportData->filter(fn ($t) => $t['loaded'] && $t['loaded'] !== 'Empty')->count();
        $emptyCount = $reportData->filter(fn ($t) => ! $t['loaded'] || $t['loaded'] === 'Empty')->count();

        return Pdf::view('pdf.trailer-loaded-report', [
            'title' => 'Trailer Loaded Report',
            'dateRange' => $report->date->format('d M Y'),
            'endDate' => $report->date,
            'startDate' => $report->date,
            'trailers' => $reportData,
            'loadedCount' => $loadedCount,
            'emptyCount' => $emptyCount,
            'showDates' => false,
        ])
            ->name('trailer-report-'.$report->date->format('Y-m-d').'.pdf')
            ->download();
    }

    private function generateRangePdf(int $days)
    {
        $this->authorize('viewAny', TrailerLoadedReport::class);

        $endDate = now()->subDay()->startOfDay();
        $startDate = $endDate->copy()->subDays($days - 1)->startOfDay();

        $reports = TrailerLoadedReport::whereBetween('date', [$startDate, $endDate])
            ->orderBy('date')
            ->get();

        $dateRange = [];
        $current = $startDate->copy();
        while ($current->lte($endDate)) {
            $dateRange[] = $current->copy();
            $current->addDay();
        }

        $trailers = Trailer::orderBy('fleet_number')->get();

        $matrix = [];
        foreach ($trailers as $trailer) {
            $matrix[$trailer->fleet_number] = [
                'registration_number' => $trailer->registration_number,
                'dates' => [],
            ];
        }

        foreach ($reports as $report) {
            $dateKey = $report->date->format('Y-m-d');
            foreach ($report->loads as $load) {
                if (isset($matrix[$load['fleet_number']])) {
                    $matrix[$load['fleet_number']]['dates'][$dateKey] = [
                        'loaded' => $load['loaded'],
                        'location' => $load['location'] ?? '',
                    ];
                }
            }
        }

        $dateHeaders = [];
        foreach ($dateRange as $date) {
            $dateHeaders[] = [
                'date' => $date->format('Y-m-d'),
                'day' => $date->format('D'),
                'dayNum' => $date->format('d'),
            ];
        }

        $summary = [];
        foreach ($dateRange as $date) {
            $dateKey = $date->format('Y-m-d');
            $loaded = 0;
            $empty = 0;
            foreach ($matrix as $fleetNumber => $data) {
                if (isset($data['dates'][$dateKey])) {
                    if ($data['dates'][$dateKey]['loaded'] && $data['dates'][$dateKey]['loaded'] !== 'Empty') {
                        $loaded++;
                    } else {
                        $empty++;
                    }
                }
            }
            $summary[$dateKey] = ['loaded' => $loaded, 'empty' => $empty];
        }

        return Pdf::view('pdf.trailer-loaded-report-range', [
            'title' => 'Trailer Loaded Report - '.$days.' Days',
            'startDate' => $startDate,
            'endDate' => $endDate,
            'dateRange' => $startDate->format('d M Y').' - '.$endDate->format('d M Y'),
            'dateHeaders' => $dateHeaders,
            'trailers' => $matrix,
            'summary' => $summary,
        ])
            ->name('trailer-report-'.$days.'-days-'.$endDate->format('Y-m-d').'.pdf')
            ->download();
    }

    public function destroy(Request $request, TrailerLoadedReport $trailerLoadedReport)
    {
        $this->authorize('delete', $trailerLoadedReport);

        $trailerLoadedReport->delete();

        return to_route('admin.trailer-loaded-reports.index');
    }
}
