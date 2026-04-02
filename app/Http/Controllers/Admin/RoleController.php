<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Roles\StoreRoleRequest;
use App\Http\Requests\Admin\Roles\UpdateRoleRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Role::class);

        $perPage = $request->integer('per_page', 25);

        $roles = QueryBuilder::for(Role::class)
            ->allowedFilters([
                AllowedFilter::partial('name'),
            ])
            ->withCount('permissions')
            ->defaultSort('name')
            ->paginate($perPage)
            ->onEachSide(3)
            ->withQueryString();

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
            'filters' => [
                'search' => $request->string('search', ''),
                'status' => $request->string('status', ''),
                'per_page' => $perPage,
                'page' => $request->integer('page', 1),
            ],
            'can' => [
                'create' => $request->user()->can('create', Role::class),
            ],
        ]);
    }

    public function create(Request $request)
    {
        $this->authorize('create', Role::class);

        $permissions = Permission::orderBy('guard_name')->orderBy('name')->get(['id', 'name', 'guard_name']);

        return Inertia::render('admin/roles/create', [
            'permissions' => $permissions,
        ]);
    }

    public function store(StoreRoleRequest $request)
    {
        $this->authorize('create', Role::class);

        $role = Role::create(['name' => $request->string('name')]);

        if ($request->has('permissions')) {
            $role->givePermissionTo($request->array('permissions'));
        }

        return to_route('admin.roles.index');
    }

    public function show(Request $request, Role $role)
    {
        $this->authorize('view', $role);

        return Inertia::render('admin/roles/show', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'permissions' => $role->permissions->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                ]),
                'created_at' => $role->created_at->toISOString(),
                'updated_at' => $role->updated_at->toISOString(),
            ],
            'can' => [
                'edit' => $request->user()->can('update', $role),
                'delete' => $request->user()->can('delete', $role),
            ],
        ]);
    }

    public function edit(Request $request, Role $role)
    {
        $this->authorize('update', $role);

        $permissions = Permission::orderBy('guard_name')->orderBy('name')->get(['id', 'name', 'guard_name']);

        return Inertia::render('admin/roles/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('id'),
            ],
            'permissions' => $permissions,
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role)
    {
        $this->authorize('update', $role);

        $role->update(['name' => $request->string('name')]);

        $role->syncPermissions($request->array('permissions', []));

        return to_route('admin.roles.show', $role);
    }

    public function destroy(Request $request, Role $role)
    {
        $this->authorize('delete', $role);

        $role->delete();

        return to_route('admin.roles.index');
    }
}
