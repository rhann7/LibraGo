<?php

namespace App\Http\Requests\Books;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BookUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $unitId = $this->route('unit')?->id;

        return [
            'book_id'   => ['required', 'exists:books,id'],
            'condition' => ['required', Rule::in(['good', 'damaged', 'lost'])],
            'status'    => ['required', Rule::in(['available', 'reserved', 'borrowed', 'damaged', 'lost'])],
            'note'      => ['nullable', 'string', 'max:500'],
        ];
    }
}