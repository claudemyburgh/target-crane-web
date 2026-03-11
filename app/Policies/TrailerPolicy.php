<?php

namespace App\Policies;

use App\Models\Trailer;
use App\Models\User;

class TrailerPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Trailer $trailer): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Trailer $trailer): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Trailer $trailer): bool
    {
        return $user->hasRole('admin');
    }
}
