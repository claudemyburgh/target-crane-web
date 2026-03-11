<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TrailerFormRequest;
use App\Models\Trailer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrailerController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Trailer::class);

        $perPage = $request->integer('per_page', 25);
        $search = $request->string('search', '');
        $status = $request->string('status', '');
        $sort = $request->string('sort', 'created_at');
        $direction = $request->string('direction', 'desc');

        $query = Trailer::query();

        if ($status === 'deleted') {
            $query->onlyTrashed();
        } elseif ($status === 'active') {
            $query->withoutTrashed();
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('fleet_number', 'like', "%{$search}%")
                    ->orWhere('registration_number', 'like', "%{$search}%")
                    ->orWhere('brand_name', 'like', "%{$search}%");
            });
        }

        $query->orderBy($sort, $direction);

        $trailers = $query->paginate($perPage)->onEachSide(3)->withQueryString();

        $brands = Trailer::distinct()->pluck('brand_name')->sort()->values();

        return Inertia::render('admin/trailers/index', [
            'trailers' => $trailers,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'brand' => $request->string('brand', ''),
                'sort' => $sort,
                'direction' => $direction,
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

        $trailers = Trailer::withTrashed()->whereIn('id', $ids);

        match ($action) {
            'delete' => $trailers->delete(),
            'restore' => $trailers->restore(),
            'force-delete' => $trailers->forceDelete(),
            default => null,
        };

        return to_route('admin.trailers.index');
    }
}
