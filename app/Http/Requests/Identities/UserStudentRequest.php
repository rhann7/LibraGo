<?php

namespace App\Http\Requests\Identities;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $studentId = $this->route('student')?->id;

        return [
            'nipd'       => ['required', 'string', 'max:255', Rule::unique('student_masters', 'nipd')->ignore($studentId)],
            'name'       => ['required', 'string', 'max:255'],
            'class_name' => ['required', 'string', 'max:255'],
        ];
    }
}