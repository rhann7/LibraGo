<?php

use App\Http\Controllers\Transactions\LoanRequestController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('loan-requests', LoanRequestController::class)
        ->only(['index', 'store', 'show']);

    Route::patch('loan-requests/{loanRequest}/approve', [LoanRequestController::class, 'approve'])
        ->name('loan-requests.approve');

    Route::patch('loan-requests/{loanRequest}/reject', [LoanRequestController::class, 'reject'])
        ->name('loan-requests.reject');
});