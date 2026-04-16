<?php

namespace App\Models\Transactions;

use App\Models\Books\BookUnit;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class LoanRequest extends Model
{
    protected $fillable = ['user_id', 'book_unit_id', 'status', 'note', 'expired_at'];

    public function user() { return $this->belongsTo(User::class); }
    public function bookUnit() { return $this->belongsTo(BookUnit::class); }
    public function loan() { return $this->hasOne(Loan::class); }
    public function tokens() { return $this->hasMany(LoanToken::class); }

    public function scopePending($query) { return $query->where('status', 'pending'); }
    public function scopeApproved($query) { return $query->where('status', 'approved'); }
    public function scopeRejected($query) { return $query->where('status', 'rejected'); }
    public function scopeTaken($query) { return $query->where('status', 'taken'); }
    public function scopeExpired($query) { return $query->where('status', 'expired'); }

    public function isPending() { return $this->status === 'pending'; }
    public function isApproved() { return $this->status === 'approved'; }
    public function isRejected() { return $this->status === 'rejected'; }
    public function isTaken() { return $this->status === 'taken'; }
    public function isExpired() { return $this->status === 'expired'; }
}