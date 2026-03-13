<?php

namespace App\Policies;

use App\Models\TrailerLoadedReport;
use App\Models\User;

class TrailerLoadedReportPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasPermissionTo('view trailer loaded reports');
    }

    public function view(User $user, TrailerLoadedReport $trailerLoadedReport): bool
    {
        return $user->hasRole('admin') || $user->hasPermissionTo('view trailer loaded reports');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasPermissionTo('create trailer loaded reports');
    }

    public function update(User $user, TrailerLoadedReport $trailerLoadedReport): bool
    {
        return $user->hasRole('admin') || $user->hasPermissionTo('create trailer loaded reports');
    }

    public function delete(User $user, TrailerLoadedReport $trailerLoadedReport): bool
    {
        return $user->hasRole('admin') || $user->hasPermissionTo('delete trailer loaded reports');
    }

    public function restore(User $user, TrailerLoadedReport $trailerLoadedReport): bool
    {
        return $user->hasRole('admin') || $user->hasPermissionTo('delete trailer loaded reports');
    }

    public function forceDelete(User $user, TrailerLoadedReport $trailerLoadedReport): bool
    {
        return $user->hasRole('admin') || $user->hasPermissionTo('delete trailer loaded reports');
    }
}
