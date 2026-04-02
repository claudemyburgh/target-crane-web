<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class PermissionController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Permission::class);

        $perPage = $request->integer('per_page', 25);

        $permissions = QueryBuilder::for(Permission::class)
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::exact('guard_name'),
            ])
            ->defaultSort('name')
            ->paginate($perPage)
            ->onEachSide(3)
            ->withQueryString();

        return Inertia::render('admin/permissions/index', [
            'permissions' => $permissions,
            'filters' => [
                'search' => $request->string('search', ''),
                'guard_name' => $request->string('guard_name', ''),
                'per_page' => $perPage,
                'page' => $request->integer('page', 1),
            ],
            'can' => [
                'create' => $request->user()->can('create', Permission::class),
            ],
        ]);
    }

    public function create(Request $request)
    {
        $this->authorize('create', Permission::class);

        return Inertia::render('admin/permissions/create');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Permission::class);

        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name'],
        ]);

        Permission::create(['name' => $request->string('name')]);

        return to_route('admin.permissions.index');
    }

    public function show(Request $request, Permission $permission)
    {
        $this->authorize('view', $permission);

        return Inertia::render('admin/permissions/show', [
            'permission' => [
                'id' => $permission->id,
                'name' => $permission->name,
                'guard_name' => $permission->guard_name,
                'roles' => $permission->roles->map(fn ($r) => [
                    'id' => $r->id,
                    'name' => $r->name,
                ]),
                'created_at' => $permission->created_at->toISOString(),
                'updated_at' => $permission->updated_at->toISOString(),
            ],
            'can' => [
                'edit' => $request->user()->can('update', $permission),
                'delete' => $request->user()->can('delete', $permission),
            ],
        ]);
    }

    public function edit(Request $request, Permission $permission)
    {
        $this->authorize('update', $permission);

        return Inertia::render('admin/permissions/edit', [
            'permission' => [
                'id' => $permission->id,
                'name' => $permission->name,
            ],
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        $this->authorize('update', $permission);

        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name,'.$permission->id],
        ]);

        $permission->update(['name' => $request->string('name')]);

        return to_route('admin.permissions.show', $permission);
    }

    public function destroy(Request $request, Permission $permission)
    {
        $this->authorize('delete', $permission);

        $permission->delete();

        return to_route('admin.permissions.index');
    }
}
