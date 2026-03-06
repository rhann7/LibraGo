<?php

use App\Http\Controllers\Auth\NipdVerificationController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/verify-nipd', [NipdVerificationController::class, 'verify'])
    ->middleware('guest')
    ->name('auth.verify-nipd');