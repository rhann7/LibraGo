<?php

use App\Http\Controllers\Transactions\FineController;
use App\Http\Controllers\Transactions\LoanController;
use App\Http\Controllers\Transactions\LoanRequestController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('loan-requests', LoanRequestController::class)->only(['index', 'store', 'show']);
    Route::patch('loan-requests/{loanRequest}/approve', [LoanRequestController::class, 'approve'])->name('loan-requests.approve');
    Route::patch('loan-requests/{loanRequest}/reject', [LoanRequestController::class, 'reject'])->name('loan-requests.reject');

    Route::get('loans/validate-token', [LoanController::class, 'validateToken'])->name('loans.validate-token');
    Route::resource('loans', LoanController::class)->only(['index', 'show']);
    Route::patch('loans/{loan}/return', [LoanController::class, 'return'])->name('loans.return');
    Route::post('loans', [LoanController::class, 'store'])->name('loans.store');

    Route::get('fines', [FineController::class, 'index'])->name('fines.index');
    Route::patch('fines/{fine}', [FineController::class, 'update'])->name('fines.update');
});