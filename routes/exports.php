<?php

use App\Http\Controllers\Identities\StudentController;
use App\Http\Controllers\Identities\TeacherController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Identities\UserController;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::prefix('export')->name('export.')->group(function () {
        Route::get('users', [UserController::class, 'export'])->name('users');
        Route::get('students', [StudentController::class, 'export'])->name('students');
        Route::get('teachers', [TeacherController::class, 'export'])->name('teachers');
    });
});