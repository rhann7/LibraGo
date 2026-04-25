<?php

namespace App\Http\Controllers\Books;

use App\Http\Controllers\Controller;
use App\Http\Requests\Books\BookCategoryRequest;
use App\Models\Books\BookCategory;
use App\Traits\CanExport;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class BookCategoryController extends Controller implements HasMiddleware
{
    use CanExport;

    public function export(Request $request)
    {
        $categories = BookCategory::query()
            ->withCount('books')
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->latest()
            ->get();

        return $this->exportData($categories,
            'book-categories',
            ['ID', 'Name', 'Slug', 'Total Books'],
            fn($c) => [
                $c->id,
                $c->name,
                $c->slug,
                $c->books_count,
            ]
        );
    }

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

        return Inertia::render('books/categories/index', [
            'categories' => $this->getCategories($request->search),
            'filters'    => $request->only('search'),
            'can'        => [
                'create' => $admin,
                'edit'   => $admin,
                'delete' => $admin,
            ],
        ]);
    }

    public function store(BookCategoryRequest $request)
    {
        BookCategory::create($request->validated());
        return to_route('books.categories.index')->with('success', 'Category created successfully');
    }

    public function update(BookCategoryRequest $request, BookCategory $category)
    {
        $category->update($request->validated());
        return to_route('books.categories.index')->with('success', 'Category updated successfully');
    }

    public function destroy(BookCategory $category)
    {
        $category->books()->update(['book_category_id' => null]);
        $category->delete();
        return to_route('books.categories.index')->with('success', 'Category deleted successfully');
    }

    private function getCategories(?string $search = null)
    {
        return $this->transformCategories(
            BookCategory::query()
                ->withCount('books')
                ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%"))
                ->latest()
                ->paginate(10)
                ->withQueryString()
        );
    }

    private function transformSingleCategory(BookCategory $category)
    {
        return [
            'id'           => $category->id,
            'name'         => $category->name,
            'slug'         => $category->slug,
            'books_count'  => $category->books_count ?? 0,
            'form_default' => ['name' => $category->name],
        ];
    }

    private function transformCategories($pagination)
    {
        $pagination->getCollection()->transform(fn($c) => $this->transformSingleCategory($c));
        return $pagination;
    }
}