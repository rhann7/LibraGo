<?php

namespace App\Models\Books;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Book extends Model
{
    protected $fillable = ['book_category_id', 'title', 'slug', 'author', 'publisher', 'isbn', 'cover', 'year', 'synopsis', 'pages'];
    protected static function boot() {
        parent::boot();
        static::creating(function ($book) { $book->slug = Str::slug($book->title); });
        static::updating(function ($book) { $book->slug = Str::slug($book->title); });
    }

    public function category() { return $this->belongsTo(BookCategory::class, 'book_category_id'); }
    public function units() { return $this->hasMany(BookUnit::class); }

    public function getCoverUrlAttribute() { return $this->cover ? Storage::url($this->cover) : null; }
}