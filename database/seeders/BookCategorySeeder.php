<?php

namespace Database\Seeders;

use App\Models\Books\BookCategory;
use Illuminate\Database\Seeder;

class BookCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Fiction',
            'Non-Fiction',
            'Science Fiction',
            'Fantasy',
            'Biography',
            'History',
            'Children\'s Books',
            'Mystery',
            'Romance',
            'Horror',
        ];

        foreach ($categories as $category) {
            BookCategory::create(['name' => $category]);
        }
    }
}