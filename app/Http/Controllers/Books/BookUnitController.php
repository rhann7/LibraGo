<?php

namespace App\Http\Controllers\Books;

use App\Http\Controllers\Controller;
use App\Http\Requests\Books\BookUnitRequest;
use App\Models\Books\Book;
use App\Models\Books\BookUnit;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class BookUnitController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('role:admin'),
        ];
    }

    public function index(Request $request)
    {
        return Inertia::render('books/units/index', [
            'units'   => $this->getUnits($request->search, $request->condition, $request->status),
            'filters' => $request->only(['search', 'condition', 'status']),
            'books'   => Book::orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function store(BookUnitRequest $request)
    {
        $data = $request->validated();
        $data['code'] = BookUnit::generateCode();
        BookUnit::create($data);
        return to_route('book-units.index')->with('success', 'Unit created successfully with code ' . $data['code']);
    }

    public function update(BookUnitRequest $request, BookUnit $bookUnit)
    {
        $data = $request->validated();
        $bookUnit->update($data);
        return to_route('book-units.index')->with('success', 'Unit updated successfully');
    }

    public function show(BookUnit $bookUnit)
    {
        return Inertia::render('books/units/show', [
            'unit' => $this->transformSingleUnit($bookUnit->load(['book.category'])),
        ]);
    }

    public function destroy(BookUnit $bookUnit)
    {
        $bookUnit->delete();
        return to_route('book-units.index')->with('success', 'Unit deleted successfully');
    }

    private function getUnits(?string $search = null, ?string $condition = null, ?string $status = null)
    {
        return $this->transformUnits(
            BookUnit::query()
                ->with(['book.category'])
                ->when($search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('code', 'like', "%$search%")
                          ->orWhereHas('book', fn($q) => $q->where('title', 'like', "%$search%"));
                    });
                })
                ->when($condition, fn($q) => $q->where('condition', $condition))
                ->when($status, fn($q) => $q->where('status', $status))
                ->orderBy('code')
                ->paginate(10)
                ->withQueryString()
        );
    }

    private function transformSingleUnit(BookUnit $unit)
    {
        return [
            'id'            => $unit->id,
            'code'          => $unit->code,
            'condition'     => $unit->condition,
            'status'        => $unit->status,
            'note'          => $unit->note ?? '',
            'book'          => [
                'id'        => $unit->book->id,
                'title'     => $unit->book->title,
                'cover_url' => $unit->book->cover_url,
                'category'  => $unit->book->category ? [
                    'id'    => $unit->book->category->id,
                    'name'  => $unit->book->category->name,
                ] : null,
            ],
            'form_default'  => [
                'book_id'   => $unit->book_id,
                'condition' => $unit->condition,
                'status'    => $unit->status,
                'note'      => $unit->note ?? '',
            ],
        ];
    }

    private function transformUnits($pagination)
    {
        $pagination->getCollection()->transform(fn($u) => $this->transformSingleUnit($u));
        return $pagination;
    }
}