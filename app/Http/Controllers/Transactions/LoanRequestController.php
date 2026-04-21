<?php

namespace App\Http\Controllers\Transactions;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transactions\LoanRequestRequest;
use App\Models\Books\BookUnit;
use App\Models\Transactions\LoanRequest;
use App\Models\Transactions\LoanToken;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LoanRequestController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('role:admin', only: ['approve', 'reject']),
        ];
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $admin = $user->isAdmin();

        return Inertia::render('transactions/loans/requests/index', [
            'requests' => $this->getLoanRequests($request->search, $request->status, $admin ? null : $user->id),
            'filters'  => $request->only(['search', 'status']),
            'can'      => [
                'approve' => $admin,
                'reject'  => $admin,
            ],
        ]);
    }

    public function store(LoanRequestRequest $request)
    {
        $user = $request->user();
        if ($user->hasOverdueLoan()) return back()->withErrors(['overdue' => 'You have an overdue loan. Please return it before making a new request.']);

        $bookUnit = BookUnit::findOrFail($request->book_unit_id);
        if ($bookUnit->status !== 'available') return back()->withErrors('Book unit is not available for loan');

        DB::transaction(function () use ($request, $bookUnit) {
            LoanRequest::create([
                'user_id'      => $request->user()->id,
                'book_unit_id' => $bookUnit->id,
                'status'       => 'pending',
            ]);

            $bookUnit->update(['status' => 'reserved']);
        });

        return back()->with('success', 'Loan request created successfully');
    }

    public function approve(LoanRequest $loanRequest)
    {
        if (!$loanRequest->isPending()) return back()->withErrors('Loan request is not pending.');
        $loanRequest->update(['status' => 'approved', 'expired_at' => now()->addDays(2)]);
        return back()->with('success', 'Loan request approved.');
    }
    
    public function reject(Request $request, LoanRequest $loanRequest)
    {
        if (!$loanRequest->isPending()) return back()->withErrors('Loan request is not pending.');
        $loanRequest->update(['status' => 'rejected', 'note' => $request->note]);
        $loanRequest->bookUnit->update(['status' => 'available']);
        return back()->with('success', 'Loan request rejected.');
    }

    public function show(LoanRequest $loanRequest)
    {
        abort_if(!request()->user()->isAdmin() && $loanRequest->user_id !== request()->user()->id, 403);

        $loanRequest->load(['user', 'bookUnit.book']);
        $currentToken = null;

        if ($loanRequest->isApproved()) $currentToken = $this->ensurePickupToken($loanRequest);

        return Inertia::render('transactions/loans/requests/show', [
            'request'        => $this->transformSingleLoanRequest($loanRequest),
            'currentToken'   => $currentToken ? [
                'token'      => $currentToken->token,
                'expired_at' => $currentToken->expired_at,
                'expires_in' => now()->diffInSeconds($currentToken->expired_at, false),
            ] : null,
        ]);
    }

    private function ensurePickupToken(LoanRequest $loanRequest)
    {
        $token = $loanRequest->tokens()
            ->where('type', 'pickup')
            ->whereNull('used_at')
            ->where('expired_at', '>', now())
            ->latest()
            ->first();

        if (!$token) {
            $token = $loanRequest->tokens()->create([
                'type'       => 'pickup',
                'token'      => LoanToken::generateToken(),
                'expired_at' => now()->addMinutes(10),
            ]);
        }

        return $token;
    }

    private function getLoanRequests(?string $search = null, ?string $status = null, ?int $userId = null)
    {
        return $this->transformLoans(
            LoanRequest::query()
                ->with(['user', 'bookUnit.book'])
                ->when($userId, fn($q) => $q->where('user_id', $userId))
                ->when($search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->whereHas('user', fn($q) => $q->where('name', 'like', "%$search%"))
                          ->orWhereHas('bookUnit.book', fn($q) => $q->where('title', 'like', "%$search%"));
                    });
                })
                ->when($status, fn($q) => $q->where('status', $status))
                ->latest()
                ->paginate(10)
                ->withQueryString()
        );
    }

    private function transformSingleLoanRequest(LoanRequest $loanRequest)
    {
        return [
            'id'         => $loanRequest->id,
            'status'     => $loanRequest->status,
            'note'       => $loanRequest->note ?? '',
            'expired_at' => $loanRequest->expired_at,
            'user'       => [
                'id'     => $loanRequest->user->id,
                'name'   => $loanRequest->user->name,
            ],
            'book_unit'  => [
                'id'     => $loanRequest->bookUnit->id,
                'code'   => $loanRequest->bookUnit->code,
                'book'   => [
                    'id'        => $loanRequest->bookUnit->book->id,
                    'title'     => $loanRequest->bookUnit->book->title,
                    'cover_url' => $loanRequest->bookUnit->book->cover_url,
                ],
            ],
        ];
    }

    private function transformLoans($pagination)
    {
        $pagination->getCollection()->transform(fn($lr) => $this->transformSingleLoanRequest($lr));
        return $pagination;
    }
}