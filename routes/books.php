<?php

use App\Http\Controllers\Books\BookAuthorController;
use App\Http\Controllers\Books\BookCategoryController;
use App\Http\Controllers\Books\BookController;
use App\Http\Controllers\Books\BookPublisherController;
use App\Http\Controllers\Books\BookUnitController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('books')->name('books.')->group(function () {
        Route::resource('categories', BookCategoryController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        Route::resource('authors', BookAuthorController::class)
            ->only('index');
        
        Route::resource('publishers', BookPublisherController::class)
            ->only('index');
    });

    Route::resource('books', BookController::class)
        ->only(['index', 'store', 'update', 'show', 'destroy']);
    
    Route::resource('book-units', BookUnitController::class)
        ->only(['index', 'store', 'update', 'show', 'destroy']);
});