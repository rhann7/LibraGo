<?php

namespace App\Models;

use App\Models\Identiies\Student;
use App\Models\Identiies\Teacher;
use App\Models\Transactions\Fine;
use App\Models\Transactions\Loan;
use App\Models\Transactions\LoanRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
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
    public function loans() {  return $this->hasManyThrough(Loan::class, LoanRequest::class, 'user_id', 'loan_request_id'); }
    public function loanRequests() { return $this->hasMany(LoanRequest::class); }
    public function fines() { return $this->hasMany(Fine::class); }

    public function scopeStudents($query) { return $query->role('student'); }
    public function scopeTeachers($query) { return $query->role('teacher'); }

    public function isAdmin() { return $this->hasRole('admin'); }
    public function isStudent() { return $this->hasRole('student'); }
    public function isTeacher() { return $this->hasRole('teacher'); }

    public function getAvatarUrlAttribute(): ?string { $profile = $this->student ?? $this->teacher; return $profile?->avatar_url; }
    public function hasOverdueLoan(): bool { return $this->loans()->where('loans.status', 'overdue')->exists(); }
    public function hasUnpaidFine(): bool { return $this->fines()->where('status', 'unpaid')->exists(); }
}