<?php

namespace App\Http\Controllers\Books;

use App\Http\Controllers\Controller;
use App\Models\Books\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookAuthorController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;

        $authors = Book::query()
            ->select('author')
            ->selectRaw('COUNT(*) as books_count')
            ->whereNotNull('author')
            ->where('author', '!=', '')
            ->when($search, fn($q) => $q->where('author', 'like', "%{$search}%"))
            ->groupBy('author')
            ->orderBy('author')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('books/authors/index', [
            'authors' => $authors,
            'filters' => $request->only('search'),
        ]);
    }
}