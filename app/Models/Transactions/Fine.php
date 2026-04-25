<?php

namespace App\Models\Transactions;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Fine extends Model
{
    protected $fillable = ['loan_id', 'user_id', 'type', 'status', 'note', 'late_days', 'amount', 'paid_at'];

    protected function casts(): array
    {
        return ['paid_at' => 'datetime'];
    }

    public function loan() { return $this->belongsTo(Loan::class); }
    public function user() { return $this->belongsTo(User::class); }

    public function scopeUnpaid($query) { return $query->where('status', 'unpaid'); }
    public function scopePaid($query) { return $query->where('status', 'paid'); }

    public function isPaid(): bool { return $this->status === 'paid'; }
    public function isLate(): bool { return $this->type === 'late'; }
    public function isDamaged(): bool { return $this->type === 'damaged'; }
    public function isLost(): bool { return $this->type === 'lost'; }

    public function getFormattedAmountAttribute(): string
    {
        return 'Rp ' . number_format($this->amount, 0, ',', '.');
    }
}