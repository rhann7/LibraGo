<?php

namespace App\Http\Controllers\Identities;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\CanExport;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class UserController extends Controller implements HasMiddleware
{
    use CanExport;

    public function export(Request $request)
    {
        $users = User::query()
            ->with('roles')
            ->whereDoesntHave('roles', fn($q) => $q->where('name', 'admin'))
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%"))
            ->when($request->role, fn($q) => $q->role($request->role))
            ->latest()
            ->get();

        return $this->exportData(
            $users,
            'registered-users',
            ['ID', 'Full Name', 'Email', 'Role', 'Registered At'],
            fn($user) => [
                $user->id,
                $user->name,
                $user->email,
                $user->getRoleNames()->first() ?? '-',
                $user->created_at->format('d/m/Y H:i'),
            ]
        );
    }

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