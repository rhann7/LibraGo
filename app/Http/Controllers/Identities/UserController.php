<?php

namespace App\Http\Controllers\Identities;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [new Middleware('role:admin')];
    }

    public function index(Request $request)
    {
        return Inertia::render('identities/users/index', [
            'users'   => $this->getUsers($request->search, $request->role),
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->hasRole('admin')) return back()->withErrors('Cannot delete admin user.');
        $user->delete();
        return back()->with('success', 'User deleted successfully.');
    }

    private function getUsers(?string $search = null, ?string $role = null)
    {
        return User::query()
            ->with('roles')
            ->whereDoesntHave('roles', fn($q) => $q->where('name', 'admin'))
            ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"))
            ->when($role, fn($q) => $q->role($role))
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn($user) => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'role'       => $user->getRoleNames()->first(),
                'avatar_url' => $user->avatar_url,
                'created_at' => $user->created_at,
            ]);
    }
}