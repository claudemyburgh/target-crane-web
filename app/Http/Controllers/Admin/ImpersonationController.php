<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use function activity;

class ImpersonationController extends Controller
{
    /**
     * Start impersonating a user.
     */
    public function start(Request $request, User $user): RedirectResponse
    {
        $originalUser = Auth::user();

        // Prevent impersonating yourself
        if ($originalUser->uuid === $user->uuid) {
            return back()->with('error', 'You cannot impersonate yourself.');
        }

        // Login as the target user - package handles session automatically
        $originalUser->impersonate($user);

        activity()
            ->performedOn($user)
            ->causedBy($originalUser)
            ->log('Started impersonating user');

        return redirect()->route('dashboard')->with('success', "You are now impersonating {$user->name}.");
    }

    /**
     * Stop impersonating and return to original user.
     */
    public function stop(Request $request): RedirectResponse
    {
        // Check if impersonation is active using the package's session key
        $originalUserId = session('impersonated_by');

        if (! $originalUserId) {
            return redirect()->route('dashboard')->with('error', 'You are not impersonating anyone.');
        }

        // Get the original user (the admin who started impersonating)
        $originalUser = User::find($originalUserId);

        if (! $originalUser) {
            session()->forget('impersonated_by');
            session()->forget('impersonator_guard');
            session()->forget('impersonator_guard_using');

            return redirect()->route('dashboard')->with('error', 'Original user not found.');
        }

        // Log activity before leaving impersonation
        activity()
            ->causedBy($originalUser)
            ->log('Stopped impersonating user');

        // Clear session keys first
        session()->forget('impersonated_by');
        session()->forget('impersonator_guard');
        session()->forget('impersonator_guard_using');

        // Leave impersonation and re-login as original user
        Auth::logout();
        Auth::login($originalUser);

        return redirect()->route('admin.dashboard')->with('success', 'Stopped impersonating.');
    }
}
