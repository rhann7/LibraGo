<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Identities\UserController;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::prefix('export')->name('export.')->group(function () {
        Route::get('users', [UserController::class, 'export'])->name('users');
    });
});