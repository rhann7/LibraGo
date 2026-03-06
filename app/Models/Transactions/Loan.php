<?php

namespace App\Models\Transactions;

use App\Models\Books\BookUnit;
use App\Models\Books\BookUnitLog;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = ['loan_request_id', 'book_unit_id', 'status', 'borrowed_at', 'due_date', 'returned_at'];
    protected function casts(): array
    {
        return ['borrowed_at' => 'datetime', 'due_date' => 'datetime', 'returned_at' => 'datetime'];
    }

    public function loanRequest() { return $this->belongsTo(LoanRequest::class); }
    public function qrToken() { return $this->hasOne(LoanQrToken::class); }
    public function fines() { return $this->hasMany(Fine::class); }
    public function bookUnit() { return $this->belongsTo(BookUnit::class); }
    public function bookUnitLog() { return $this->hasOne(BookUnitLog::class); }

    public function scopeActive($query) { return $query->where('status', 'active'); }
    public function scopeOverdue($query) { return $query->where('status', 'overdue'); }
    public function scopeReturned($query) { return $query->where('status', 'returned'); }

    public function isActive(): bool { return $this->status === 'active'; }
    public function isOverdue(): bool { return $this->status === 'overdue'; }
    public function isReturned(): bool { return $this->status === 'returned'; }
    public function isLate(): bool { return now()->isAfter($this->due_date) && !$this->isReturned(); }
    public function lateDays(): int { return (int) now()->diffInDays($this->due_date); }
}