<?php

namespace App\Models\Transactions;

use Illuminate\Database\Eloquent\Model;

class LoanQrToken extends Model
{
    protected $fillable = ['loan_request_id', 'loan_id', 'type', 'token', 'expired_at', 'used_at'];
    protected function casts(): array
    {
        return ['expired_at' => 'datetime', 'used_at' => 'datetime'];
    }

    public function loanRequest() { return $this->belongsTo(LoanRequest::class); }
    public function loan() { return $this->belongsTo(Loan::class); }

    public function scopePickup($query) { return $query->where('type', 'pickup'); }
    public function scopeReturn($query) { return $query->where('type', 'return'); }

    public function isExpired() { return now()->isAfter($this->expired_at); }
    public function isUsed() { return !is_null($this->used_at); }
    public function isValid() { return !$this->isExpired() && !$this->isUsed(); }
}