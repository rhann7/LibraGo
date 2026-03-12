<?php

namespace App\Http\Requests\Books;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $bookId = $this->route('book')?->id;

        return [
            'book_category_id' => ['nullable', 'exists:book_categories,id'],
            'title'            => ['required', 'string', 'max:255', Rule::unique('books', 'title')->ignore($bookId)],
            'author'           => ['nullable', 'string', 'max:255'],
            'publisher'        => ['nullable', 'string', 'max:255'],
            'isbn'             => ['nullable', 'string', Rule::unique('books', 'isbn')->ignore($bookId)],
            'cover'            => array_filter(['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048', $bookId ? 'sometimes' : null]),
            'year'             => ['required', 'integer', 'digits:4', 'min:1000', 'max:' . date('Y')],
            'synopsis'         => ['nullable', 'string'],
            'pages'            => ['required', 'integer', 'min:1'],
        ];
    }
}