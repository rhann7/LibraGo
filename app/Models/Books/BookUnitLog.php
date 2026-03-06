<?php

namespace App\Models\Books;

use App\Models\Transactions\Loan;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class BookUnitLog extends Model
{
    protected $fillable = ['book_unit_id', 'loan_id', 'condition', 'status', 'note', 'recorded_by'];

    public function bookUnit() { return $this->belongsTo(BookUnit::class); }
    public function loan() { return $this->belongsTo(Loan::class); }
    public function recordedBy() { return $this->belongsTo(User::class, 'recorded_by'); }
}