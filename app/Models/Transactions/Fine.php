<?php

namespace App\Models\Transactions;

use Illuminate\Database\Eloquent\Model;

class Fine extends Model
{
    protected $fillable = ['loan_id', 'type', 'amount', 'note', 'status'];

    public function loan() { return $this->belongsTo(Loan::class); }

    public function scopeUnpaid($query) { return $query->where('status', 'unpaid'); }
    public function scopePaid($query) { return $query->where('status', 'paid'); }
    public function scopeLate($query) { return $query->where('type', 'late'); }
    public function scopeDamaged($query) { return $query->where('type', 'damaged'); }
    public function scopeLost($query) { return $query->where('type', 'lost'); }

    public function isPaid(): bool { return $this->status === 'paid'; }
    public function isUnpaid(): bool { return $this->status === 'unpaid'; }
    public function isLate(): bool { return $this->type === 'late'; }
    public function isDamaged(): bool { return $this->type === 'damaged'; }
    public function isLost(): bool { return $this->type === 'lost'; }
}