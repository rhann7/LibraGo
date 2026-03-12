<?php

use App\Http\Controllers\Books\BookCategoryController;
use App\Http\Controllers\Books\BookController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('books', BookController::class)
        ->only(['index', 'store', 'update', 'destroy']);
    
    Route::prefix('books')->name('books.')->group(function () {
        Route::resource('categories', BookCategoryController::class)
            ->only(['index', 'store', 'update', 'destroy']);
    });
});