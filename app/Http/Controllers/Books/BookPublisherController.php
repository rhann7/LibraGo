<?php

namespace App\Http\Controllers\Books;

use App\Http\Controllers\Controller;
use App\Models\Books\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookPublisherController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;

        $publishers = Book::query()
            ->select('publisher')
            ->selectRaw('COUNT(*) as books_count')
            ->whereNotNull('publisher')
            ->where('publisher', '!=', '')
            ->when($search, fn($q) => $q->where('publisher', 'like', "%{$search}%"))
            ->groupBy('publisher')
            ->orderBy('publisher')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('books/publishers/index', [
            'publishers' => $publishers,
            'filters' => $request->only('search'),
        ]);
    }
}