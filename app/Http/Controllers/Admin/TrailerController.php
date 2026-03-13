<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TrailerFormRequest;
use App\Models\Trailer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class TrailerController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Trailer::class);

        $perPage = $request->integer('per_page', 25);

        $trailers = QueryBuilder::for(Trailer::class)
            ->allowedFilters([
                AllowedFilter::partial('search', 'fleet_number'),
                AllowedFilter::partial('search', 'registration_number'),
                AllowedFilter::partial('search', 'brand_name'),
                AllowedFilter::exact('brand', 'brand_name'),
                AllowedFilter::callback('status', function ($query, $value) {
                    if ($value === 'deleted') {
                        $query->onlyTrashed();
                    } elseif ($value === 'active') {
                        $query->withoutTrashed();
                    }
                }),
            ])
            ->allowedSorts([
                'fleet_number',
                'registration_number',
                'brand_name',
                'axles_amount',
                'license_expiry_date',
                'order_column',
                AllowedSort::field('order', 'order_column'),
            ])
            ->defaultSort('order_column')
            ->paginate($perPage)
            ->onEachSide(3)
            ->withQueryString();

        $brands = Trailer::distinct()->pluck('brand_name')->sort()->values();

        return Inertia::render('admin/trailers/index', [
            'trailers' => $trailers,
            'filters' => [
                'search' => $request->string('search', ''),
                'status' => $request->string('status', ''),
                'brand' => $request->string('brand', ''),
                'sort' => $request->string('sort', 'order_column'),
                'direction' => $request->string('direction', 'asc'),
                'per_page' => $perPage,
                'page' => $request->integer('page', 1),
            ],
            'brands' => $brands,
            'can' => [
                'create' => $request->user()->hasRole('admin'),
                'edit' => $request->user()->hasRole('admin'),
                'delete' => $request->user()->hasRole('admin'),
            ],
        ]);
    }

    public function create(Request $request)
    {
        $this->authorize('create', Trailer::class);

        return Inertia::render('admin/trailers/create');
    }

    public function store(TrailerFormRequest $request)
    {
        $this->authorize('create', Trailer::class);

        Trailer::create($request->validated());

        return to_route('admin.trailers.index');
    }

    public function show(Request $request, Trailer $trailer)
    {
        $this->authorize('view', $trailer);

        return Inertia::render('admin/trailers/show', [
            'trailer' => $trailer,
            'can' => [
                'edit' => $request->user()->can('update', $trailer),
                'delete' => $request->user()->can('delete', $trailer),
            ],
        ]);
    }

    public function edit(Request $request, Trailer $trailer)
    {
        $this->authorize('update', $trailer);

        return Inertia::render('admin/trailers/edit', [
            'trailer' => [
                ...$trailer->toArray(),
                'license_expiry_date' => $trailer->license_expiry_date?->format('Y-m-d'),
            ],
        ]);
    }

    public function update(TrailerFormRequest $request, Trailer $trailer)
    {
        $this->authorize('update', $trailer);

        $trailer->update($request->validated());

        return to_route('admin.trailers.show', $trailer);
    }

    public function destroy(Request $request, Trailer $trailer)
    {
        $this->authorize('delete', $trailer);

        $trailer->delete();

        return to_route('admin.trailers.index');
    }

    public function restore(Request $request, Trailer $trailer)
    {
        $this->authorize('delete', $trailer);

        $trailer->restore();

        return to_route('admin.trailers.index');
    }

    public function forceDelete(Request $request, Trailer $trailer)
    {
        $this->authorize('delete', $trailer);

        $trailer->forceDelete();

        return to_route('admin.trailers.index');
    }

    public function bulk(Request $request)
    {
        $this->authorize('viewAny', Trailer::class);

        if (! $request->user()->hasRole('admin')) {
            abort(403);
        }

        $action = $request->string('action');
        $ids = $request->array('ids');

        match ((string) $action) {
            'reorder' => Trailer::setNewOrder($ids),
            default => $this->handleDefaultBulkAction((string) $action, $ids),
        };

        return to_route('admin.trailers.index');
    }

    private function handleDefaultBulkAction(string $action, array $ids): void
    {
        $trailers = Trailer::withTrashed()->whereIn('id', $ids);

        match ($action) {
            'delete' => $trailers->delete(),
            'restore' => $trailers->restore(),
            'force-delete' => $trailers->forceDelete(),
            default => null,
        };
    }
}
