<?php

namespace App\Http\Controllers\Books;

use App\Http\Controllers\Controller;
use App\Http\Requests\Books\BookRequest;
use App\Models\Books\Book;
use App\Models\Books\BookCategory;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BookController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('role:admin', only: ['store', 'update', 'destroy']),
        ];
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $admin = $user->isAdmin();

        return Inertia::render('books/index', [
            'books'   => $this->getBooks($request->search, $request->category, $request->year),
            'filters' => $request->only(['search', 'category', 'year']),
            'can'     => [
                'create' => $admin,
                'edit'   => $admin,
                'delete' => $admin,
            ],
            'categories' => BookCategory::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(BookRequest $request)
    {
        $data = $request->validated();
        if ($request->hasFile('cover')) $data['cover'] = $request->file('cover')->store('covers', 'public');

        Book::create($data);
        return to_route('books.index')->with('success', 'Book created successfully');
    }
    
    public function update(BookRequest $request, Book $book)
    {
        $data = $request->validated();
        if ($request->hasFile('cover')) {
            if ($book->cover) Storage::disk('public')->delete($book->cover);
            $data['cover'] = $request->file('cover')->store('covers', 'public');
        } else {
            unset($data['cover']);
        }

        $book->update($data);
        return to_route('books.index')->with('success', 'Book updated successfully');
    }

    public function destroy(Book $book)
    {
        if ($book->cover) Storage::disk('public')->delete($book->cover);
        $book->delete();
        return to_route('books.index')->with('success', 'Book deleted successfully');
    }

    private function getBooks(?string $search = null, ?int $category = null, ?int $year = null)
    {
        return $this->transformBooks(
            Book::query()
                ->with('category')
                ->withCount('units')
                ->when($search, fn($q) => $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('publisher', 'like', "%{$search}%"))
                ->when($category, fn($q) => $q->where('book_category_id', $category))
                ->when($year, fn($q) => $q->where('year', $year))
                ->latest()
                ->paginate(10)
                ->withQueryString()
        );
    }

    private function transformSingleBook(Book $book)
    {
        return [
            'id'           => $book->id,
            'title'        => $book->title,
            'slug'         => $book->slug,
            'author'       => $book->author ?? '',
            'publisher'    => $book->publisher ?? '',
            'isbn'         => $book->isbn,
            'cover_url'    => $book->cover_url,
            'year'         => $book->year,
            'synopsis'     => $book->synopsis,
            'pages'        => $book->pages,
            'units_count'  => $book->units_count ?? 0,
            'category'     => $book->category ? [
                'id'       => $book->category->id,
                'name'     => $book->category->name,
            ] : null,
            'form_default'         => [
                'book_category_id' => $book->book_category_id,
                'title'            => $book->title,
                'author'           => $book->author,
                'publisher'        => $book->publisher,
                'isbn'             => $book->isbn ?? '',
                'cover'            => null,
                'year'             => $book->year,
                'synopsis'         => $book->synopsis ?? '',
                'pages'            => $book->pages,
            ],
        ];
    }

    private function transformBooks($pagination)
    {
        $pagination->getCollection()->transform(fn($b) => $this->transformSingleBook($b));
        return $pagination;
    }
}