<?php

namespace App\Http\Controllers;

use App\Models\Books\Book;
use App\Models\Books\BookCategory;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $popularBooks = Book::query()
            ->with('category')
            ->withCount(['units as loans_count' => function ($query) {
                $query->whereHas('loanRequests', function ($q) {
                    $q->whereHas('loan');
                });
            }])
            ->orderByDesc('loans_count')
            ->take(5)
            ->get()
            ->map(fn($book) => [
                'id'        => $book->id,
                'title'     => $book->title,
                'author'    => $book->author,
                'cover_url' => $book->cover_url,
                'category'  => $book->category?->name,
                'loans'     => $book->loans_count,
            ]);

        $categories = BookCategory::query()
            ->withCount('books')
            ->having('books_count', '>', 0)
            ->orderByDesc('books_count')
            ->take(8)
            ->get()
            ->map(fn($cat) => [
                'id'    => $cat->id,
                'name'  => $cat->name,
                'total' => $cat->books_count,
            ]);

        return Inertia::render('home', [
            'popular_books' => $popularBooks,
            'categories'    => $categories,
        ]);
    }
}