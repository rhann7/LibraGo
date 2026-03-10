<?php

use App\Http\Controllers\Books\BookCategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('books')->name('books.')->group(function () {
    Route::resource('categories', BookCategoryController::class)
        ->only(['index', 'store', 'update', 'destroy']);
});