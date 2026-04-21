<?php

namespace App\Http\Controllers;

use App\Models\Books\Book;
use App\Models\Books\BookUnit;
use App\Models\Transactions\Loan;
use App\Models\Transactions\LoanRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class DashboardController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [new Middleware('auth')];
    }

    public function __invoke(Request $request)
    {
        $user = $request->user();

        return Inertia::render('dashboard', [
            'stats'    => $user->hasRole('admin') ? $this->getAdminStats() : $this->getUserStats($user),
            'activity' => $user->hasRole('admin') ? $this->getAdminActivity() : null,
        ]);
    }

    private function getAdminStats()
    {
        return [
            'users' => [
                'total'    => User::role(['student', 'teacher'])->count(),
                'students' => User::role('student')->count(),
                'teachers' => User::role('teacher')->count(),
            ],
            'books' => [
                'total' => Book::count(),
                'units' => BookUnit::count(),
            ],
            'loans' => [
                'total'    => Loan::count(),
                'pending'  => Loan::pending()->count(),
                'active'   => Loan::active()->count(),
                'returned' => Loan::returned()->count(),
                'overdue'  => Loan::active()->where('due_date', '<', now())->count(),
            ],
        ];
    }

    private function getAdminActivity()
    {
        $months = collect(range(5, 0))->map(function ($i) {
            $date = now()->subMonths($i);
            return [
                'month' => $date->format('M Y'),
                'total' => Loan::whereYear('created_at', $date->year)
                            ->whereMonth('created_at', $date->month)
                            ->count(),
            ];
        });

        $recent = collect()
            ->merge(
                LoanRequest::with('user', 'bookUnit.book')
                    ->pending()
                    ->latest()
                    ->take(4)
                    ->get()
                    ->map(fn($lr) => [
                        'type'    => 'request',
                        'message' => "{$lr->user->name} requested {$lr->bookUnit->book->title}",
                        'time'    => $lr->created_at,
                    ])
            )
            ->merge(
                Loan::with('loanRequest.user', 'loanRequest.bookUnit.book')
                    ->returned()
                    ->latest('returned_at')
                    ->take(2)
                    ->get()
                    ->map(fn($loan) => [
                        'type'    => 'returned',
                        'message' => "{$loan->loanRequest->user->name} returned {$loan->loanRequest->bookUnit->book->title}",
                        'time'    => $loan->returned_at,
                    ])
            )
            ->merge(
                Loan::with('loanRequest.user', 'loanRequest.bookUnit.book')
                    ->active()
                    ->where('due_date', '<', now())
                    ->latest('due_date')
                    ->take(2)
                    ->get()
                    ->map(fn($loan) => [
                        'type'    => 'overdue',
                        'message' => "{$loan->loanRequest->user->name} overdue on {$loan->loanRequest->bookUnit->book->title}",
                        'time'    => $loan->due_date,
                    ])
            )
            ->sortByDesc('time')
            ->take(8)
            ->values();

        return [
            'chart'  => $months,
            'recent' => $recent,
        ];
    }

    private function getUserStats(User $user)
    {
        $chart = collect(range(5, 0))->map(function ($i) use ($user) {
            $date = now()->subMonths($i);
            return [
                'month' => $date->format('M Y'),
                'total' => $user->loans()
                    ->whereYear('loans.created_at', $date->year)
                    ->whereMonth('loans.created_at', $date->month)
                    ->count(),
            ];
        });

        return [
            'total'   => $user->loans()->count(),
            'active'  => $user->loans()->where('loans.status', 'active')->count(),
            'overdue' => $user->loans()->where('loans.status', 'active')->where('loans.due_date', '<', now())->count(),
            'chart'   => $chart,
        ];
    }
}