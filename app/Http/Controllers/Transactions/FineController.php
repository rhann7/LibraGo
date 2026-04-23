<?php

namespace App\Http\Controllers\Transactions;

use App\Http\Controllers\Controller;
use App\Models\Transactions\Fine;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class FineController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [new Middleware('role:admin', only: ['update'])];
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        return Inertia::render('transactions/fines/index', [
            'fines'   => $this->getFines($request->search, $request->status, $isAdmin ? null : $user->id, $request->type),
            'filters' => $request->only(['search', 'status', 'type']),
            'can'     => ['update' => $isAdmin],
        ]);
    }

    public function update(Fine $fine)
    {
        if ($fine->isPaid()) {
            return back()->withErrors('Fine is already paid.');
        }

        $fine->update([
            'status'  => 'paid',
            'paid_at' => now(),
        ]);

        return back()->with('success', 'Fine marked as paid.');
    }

    private function getFines(?string $search = null, ?string $status = null, ?int $userId = null, ?string $type = null)
    {
        return $this->transformFines(
            Fine::query()
                ->with('loan.loanRequest.bookUnit.book', 'user')
                ->when($search, fn($q) => $q->whereHas('user', fn($q) => $q->where('name', 'like', "%{$search}%")))
                ->when($status, fn($q) => $q->where('status', $status))
                ->when($type, fn($q) => $q->where('type', $type))
                ->when($userId, fn($q) => $q->where('user_id', $userId))
                ->latest()
                ->paginate(10)
                ->withQueryString()
        );
    }

    private function transformSingleFine(Fine $fine)
    {
        return [
            'id'               => $fine->id,
            'user'             => [
                'id'           => $fine->user->id,
                'name'         => $fine->user->name,
            ],
            'book'             => [
                'title'        => $fine->loan->loanRequest->bookUnit->book->title,
                'cover_url'    => $fine->loan->loanRequest->bookUnit->book->cover_url,
            ],
            'type'             => $fine->type,
            'late_days'        => $fine->late_days,
            'amount'           => $fine->amount,
            'formatted_amount' => $fine->formatted_amount,
            'status'           => $fine->status,
            'paid_at'          => $fine->paid_at,
            'created_at'       => $fine->created_at,
        ];
    }

    private function transformFines($pagination)
    {
        $pagination->getCollection()->transform(fn($fine) => $this->transformSingleFine($fine));
        return $pagination;
    }
}