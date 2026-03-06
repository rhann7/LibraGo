<?php

namespace App\Models\Transactions;

use App\Models\Books\BookUnit;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class LoanRequest extends Model
{
    protected $fillable = ['user_id', 'book_unit_id', 'status', 'note'];

    public function user() { return $this->belongsTo(User::class); }
    public function bookUnit() { return $this->belongsTo(BookUnit::class); }
    public function loan() { return $this->hasOne(Loan::class); }
    public function qrTokens() { return $this->hasMany(LoanQrToken::class); }

    public function scopePending($query) { return $query->where('status', 'pending'); }
    public function scopeApproved($query) { return $query->where('status', 'approved'); }
    public function scopeRejected($query) { return $query->where('status', 'rejected'); }

    public function isPending() { return $this->status === 'pending'; }
    public function isApproved() { return $this->status === 'approved'; }
    public function isRejected() { return $this->status === 'rejected'; }
    public function isTaken() { return $this->status === 'taken'; }
}