<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    protected function profileRules(?int $userId = null): array
    {
        return [
            'name'   => $this->nameRules(),
            'email'  => $this->emailRules($userId),
            'avatar' => $this->avatarRules(),
            'bio'    => $this->bioRules(),
        ];
    }

    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    protected function emailRules(?int $userId = null): array
    {
        return ['required', 'string', 'email', 'max:255', $userId === null ? Rule::unique(User::class) : Rule::unique(User::class)->ignore($userId)];
    }

    protected function avatarRules(): array
    {
        return ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'];
    }

    protected function bioRules(): array
    {
        return ['nullable', 'string', 'max:500'];
    }
}