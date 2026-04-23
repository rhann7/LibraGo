<?php

use App\Http\Controllers\Identities\StudentController;
use App\Http\Controllers\Identities\TeacherController;
use App\Http\Controllers\Identities\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('students', StudentController::class)->only(['index', 'store', 'update', 'show', 'destroy']);
    Route::resource('teachers', TeacherController::class)->only(['index', 'store', 'update', 'show', 'destroy']);
    Route::resource('users', UserController::class)->only(['index', 'destroy']);
});