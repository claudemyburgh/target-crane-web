<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    protected function isLastAdmin(Role $model): bool
    {
        if ($model->name !== 'admin') {
            return false;
        }

        return Role::where('name', 'admin')->count() <= 1;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, Role $model): bool
    {
        return $user->hasRole('admin');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Role $model): bool
    {
        if ($this->isLastAdmin($model)) {
            return false;
        }

        return $user->hasRole('admin');
    }

    public function delete(User $user, Role $model): bool
    {
        if ($this->isLastAdmin($model)) {
            return false;
        }

        return $user->hasRole('admin');
    }

    public function restore(User $user, Role $model): bool
    {
        return $user->hasRole('admin');
    }

    public function forceDelete(User $user, Role $model): bool
    {
        if ($this->isLastAdmin($model)) {
            return false;
        }

        return $user->hasRole('admin');
    }
}
