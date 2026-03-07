<?php

namespace App\Models;

use App\Models\Identiies\Student;
use App\Models\Identiies\Teacher;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, HasRoles, Notifiable;

    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = ['password', 'remember_token'];
    protected $appends = ['avatar_url'];
    protected function casts(): array
    {
        return ['password' => 'hashed', 'email_verified_at' => 'datetime'];
    }

    public function student() { return $this->hasOne(Student::class); }
    public function teacher() { return $this->hasOne(Teacher::class); }

    public function scopeStudents($query) { return $query->role('student'); }
    public function scopeTeachers($query) { return $query->role('teacher'); }

    public function isStudent() { return $this->hasRole('student'); }
    public function isTeacher() { return $this->hasRole('teacher'); }

    public function getAvatarUrlAttribute(): ?string { $profile = $this->student ?? $this->teacher; return $profile?->avatar_url; }
}