<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Identiies\StudentMaster;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    public function create(array $input): User
    {
        Validator::make($input, [
            'student_master_id' => ['required', 'integer', 'exists:student_masters,id'],
            'email'             => $this->emailRules(),
            'password'          => $this->passwordRules(),
        ])->validate();

        $studentMaster = StudentMaster::findOrFail($input['student_master_id']);

        $user = User::create([
            'name'     => $studentMaster->name,
            'email'    => $input['email'],
            'password' => $input['password'],
        ]);
        
        $user->assignRole('student');
        $user->student()->create(['student_master_id' => $studentMaster->id]);

        return $user;
    }
}