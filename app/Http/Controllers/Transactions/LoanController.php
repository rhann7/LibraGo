<?php

namespace App\Http\Controllers\Transactions;

use App\Http\Controllers\Controller;
use App\Models\Transactions\Loan;
use App\Models\Transactions\LoanToken;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LoanController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('role:admin', only: ['store', 'return']),
        ];
    }
 
    public function index(Request $request)
    {
        $user  = $request->user();
        $admin = $user->isAdmin();
 
        return Inertia::render('transactions/loans/index', [
            'loans'      => $this->getLoans($request->search, $request->status, $admin ? null : $user->id),
            'filters'    => $request->only(['search', 'status']),
            'can'        => [
                'store'  => $admin,
                'return' => $admin,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['token' => ['required', 'string', 'size:8', 'exists:loan_tokens,token']]);
 
        $loanToken = LoanToken::where('token', $request->token)
            ->where('type', 'pickup')
            ->whereNull('used_at')
            ->where('expired_at', '>', now())
            ->first();
 
        if (!$loanToken) return back()->withErrors('Token is invalid or has expired.');
        $loanRequest = $loanToken->loanRequest;
        if (!$loanRequest->isApproved()) return back()->withErrors('Loan request is not approved.');
 
        DB::transaction(function () use ($loanToken, $loanRequest) {
            Loan::create([
                'loan_request_id' => $loanRequest->id,
                'loan_token_id'   => $loanToken->id,
                'status'          => 'active',
                'borrowed_at'     => now(),
                'due_date'        => now()->addDays(7),
            ]);
 
            $loanToken->update(['used_at' => now()]);
            $loanRequest->update(['status' => 'taken']);
            $loanRequest->bookUnit->update(['status' => 'borrowed']);
        });
 
        return back()->with('success', 'Loan created successfully.');
    }
 
    public function show(Loan $loan)
    {
        abort_if(!request()->user()->isAdmin() && $loan->loanRequest->user_id !== request()->user()->id, 403);

        $loan->load(['loanRequest.user', 'loanRequest.bookUnit.book']);
        $currentToken = null;

        if ($loan->isActive() && !request()->user()->isAdmin()) $currentToken = $this->ensureReturnToken($loan);

        return Inertia::render('transactions/loans/show', [
            'loan'           => $this->transformSingleLoan($loan),
            'currentToken'   => $currentToken ? [
                'token'      => $currentToken->token,
                'expired_at' => $currentToken->expired_at,
                'expires_in' => now()->diffInSeconds($currentToken->expired_at, false),
            ] : null,
            'can'            => ['return' => request()->user()->isAdmin()],
        ]);
    }

    public function return(Request $request, Loan $loan)
    {
        $request->validate(['token' => ['required', 'string', 'size:8', 'exists:loan_tokens,token']]);

        if (!$loan->isActive()) return back()->withErrors('Loan is not active.');

        $loanToken = LoanToken::where('token', $request->token)
            ->where('type', 'return')
            ->whereNull('used_at')
            ->where('expired_at', '>', now())
            ->first();

        if (!$loanToken) return back()->withErrors('Token is invalid or has expired.');
 
        DB::transaction(function () use ($loan, $loanToken) {
            $loan->update([
                'status'      => 'returned',
                'returned_at' => now(),
            ]);
 
            $loanToken->update(['used_at' => now()]);
            $loan->loanRequest->bookUnit->update(['status' => 'available']);
        });
 
        return back()->with('success', 'Loan returned successfully.');
    }

    public function validateToken(Request $request)
    {
        $request->validate(['token' => ['required', 'string', 'size:8']]);

        $loanToken = LoanToken::where('token', $request->token)
            ->where('type', 'pickup')
            ->whereNull('used_at')
            ->where('expired_at', '>', now())
            ->first();

        if (!$loanToken) return response()->json(['message' => 'Token is invalid or has expired.'], 422);

        $loanRequest = $loanToken->loanRequest->load(['user', 'bookUnit.book']);
        if (!$loanRequest->isApproved()) return response()->json(['message' => 'Loan request is not approved.'], 422);

        return response()->json([
            'id'        => $loanRequest->id,
            'user'      => ['id' => $loanRequest->user->id, 'name' => $loanRequest->user->name],
            'book_unit' => [
                'id'   => $loanRequest->bookUnit->id,
                'code' => $loanRequest->bookUnit->code,
                'book' => [
                    'title'     => $loanRequest->bookUnit->book->title,
                    'cover_url' => $loanRequest->bookUnit->book->cover_url,
                ],
            ],
        ]);
    }
 
    private function ensureReturnToken(Loan $loan)
    {
        $token = $loan->loanRequest->tokens()
            ->where('type', 'return')
            ->whereNull('used_at')
            ->where('expired_at', '>', now())
            ->latest()
            ->first();
 
        if (!$token) {
            $token = $loan->loanRequest->tokens()->create([
                'type'       => 'return',
                'token'      => LoanToken::generateToken(),
                'expired_at' => now()->addMinutes(10),
            ]);
        }
 
        return $token;
    }
 
    private function getLoans(?string $search = null, ?string $status = null, ?int $userId = null)
    {
        return $this->transformLoans(
            Loan::query()
                ->with(['loanRequest.user', 'loanRequest.bookUnit.book'])
                ->when($userId, fn($q) => $q->whereHas('loanRequest', fn($q) => $q->where('user_id', $userId)))
                ->when($search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->whereHas('loanRequest.user', fn($q) => $q->where('name', 'like', "%$search%"))
                            ->orWhereHas('loanRequest.bookUnit.book', fn($q) => $q->where('title', 'like', "%$search%"));
                    });
                })
                ->when($status, fn($q) => $q->where('status', $status))
                ->latest()
                ->paginate(10)
                ->withQueryString()
        );
    }
 
    private function transformSingleLoan(Loan $loan)
    {
        return [
            'id'          => $loan->id,
            'status'      => $loan->status,
            'borrowed_at' => $loan->borrowed_at,
            'due_date'    => $loan->due_date,
            'returned_at' => $loan->returned_at,
            'is_overdue'  => $loan->isOverdue(),
            'late_days'   => $loan->lateDays(),
            'user'        => [
                'id'   => $loan->loanRequest->user->id,
                'name' => $loan->loanRequest->user->name,
            ],
            'book_unit'   => [
                'id'   => $loan->loanRequest->bookUnit->id,
                'code' => $loan->loanRequest->bookUnit->code,
                'book' => [
                    'id'        => $loan->loanRequest->bookUnit->book->id,
                    'title'     => $loan->loanRequest->bookUnit->book->title,
                    'cover_url' => $loan->loanRequest->bookUnit->book->cover_url,
                ],
            ],
        ];
    }

    private function transformLoans($pagination)
    {
        $pagination->getCollection()->transform(fn($loan) => $this->transformSingleLoan($loan));
        return $pagination;
    }
}