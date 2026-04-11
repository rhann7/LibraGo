<?php

namespace App\Models\Books;

use App\Models\Transactions\Loan;
use App\Models\Transactions\LoanRequest;
use Illuminate\Database\Eloquent\Model;

class BookUnit extends Model
{
    protected $fillable = ['book_id', 'code', 'condition', 'status', 'note'];

    public static function generateCode()
    {
        $lastId = self::max('id') ?? 0;
        $nextId = $lastId + 1;
        $date = date('dmY');

        return "BU-{$date}-" . str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }

    public function book() { return $this->belongsTo(Book::class); }
    public function logs() { return $this->hasMany(BookUnitLog::class); }
    public function loanRequests() { return $this->hasMany(LoanRequest::class); }
    public function activeLoan() { return $this->hasOne(Loan::class)->where('status', 'active'); }

    public function scopeAvailable($query) { return $query->where('status', 'available'); }
    public function scopeBorrowed($query) { return $query->where('status', 'borrowed'); }
    public function scopeLost($query) { return $query->where('status', 'lost'); }

    public function isAvailable(): bool { return $this->status === 'available'; }
    public function isLost(): bool { return $this->status === 'lost'; }
}