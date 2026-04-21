<?php

namespace App\Models\Transactions;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = ['loan_request_id', 'loan_token_id', 'status', 'borrowed_at', 'due_date', 'returned_at'];
    protected function casts(): array
    {
        return ['borrowed_at' => 'datetime', 'due_date' => 'datetime', 'returned_at' => 'datetime'];
    }

    public function loanRequest() { return $this->belongsTo(LoanRequest::class); }
    public function token() { return $this->belongsTo(LoanToken::class, 'loan_token_id'); }
    public function fine() { return $this->hasOne(Fine::class); }

    public function scopeActive($query) { return $query->where('status', 'active'); }
    public function scopeOverdue($query) { return $query->where('status', 'overdue'); }
    public function scopeReturned($query) { return $query->where('status', 'returned'); }

    public function isActive(): bool { return $this->status === 'active'; }
    public function isOverdue(): bool { return $this->status === 'overdue'; }
    public function isReturned(): bool { return $this->status === 'returned'; }

    public function fineAmount(): int { return $this->lateDays() * 2000; }
}