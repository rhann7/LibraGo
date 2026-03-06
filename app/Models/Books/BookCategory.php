<?php

namespace App\Models\Books;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BookCategory extends Model
{
    protected $fillable = ['name', 'slug'];
    protected static function boot() {
        parent::boot();
        static::creating(function ($category) { $category->slug = Str::slug($category->name); });
        static::updating(function ($category) { $category->slug = Str::slug($category->name); });
    }

    public function books() { return $this->hasMany(Book::class, 'book_category_id'); }
}