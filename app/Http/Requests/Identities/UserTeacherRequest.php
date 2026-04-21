<?php

namespace App\Http\Requests\Identities;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserTeacherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $teacherId = $this->route('teacher')?->id;
        $userId = $this->route('teacher')?->user_id;

        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)->ignore($userId)],
            'nik'      => ['required', 'string', 'max:255', Rule::unique('teachers', 'nik')->ignore($teacherId)],
            'password' => array_filter([$teacherId ? 'nullable' : 'required', 'string', Password::default(), 'confirmed']),
        ];
    }
}