<?php

namespace Database\Seeders;

use App\Models\Books\Book;
use App\Models\Books\BookCategory;
use App\Models\Books\BookUnit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $categories = BookCategory::pluck('id')->toArray();

        $books = [
            ['title' => 'Fisika',                 'author' => 'Kemendikbud', 'publisher' => 'Erlangga', 'year' => 2020, 'pages' => 200],
            ['title' => 'Kimia',                  'author' => 'Kemendikbud', 'publisher' => 'Erlangga', 'year' => 2019, 'pages' => 300],
            ['title' => 'Matematika',             'author' => 'Kemendikbud', 'publisher' => 'Erlangga', 'year' => 2021, 'pages' => 150],
            ['title' => 'Ekonomi',                'author' => 'Kemendikbud', 'publisher' => 'Erlangga', 'year' => 2022, 'pages' => 250],
            ['title' => 'Bahasa Inggris',         'author' => 'Kemendikbud', 'publisher' => 'Erlangga', 'year' => 2020, 'pages' => 180],
            ['title' => 'Informatika',            'author' => 'Kemendikbud', 'publisher' => 'Erlangga', 'year' => 2023, 'pages' => 220],
            ['title' => 'Biologi',                'author' => 'Kemendikbud', 'publisher' => 'Erlangga', 'year' => 2018, 'pages' => 175],
            ['title' => 'Geografi',               'author' => 'Kemendikbud', 'publisher' => 'Erlangga', 'year' => 2021, 'pages' => 260],
            ['title' => 'Sejarah',                'author' => 'Kemendikbud', 'publisher' => 'Erlangga', 'year' => 2019, 'pages' => 310],
            ['title' => 'Pendidikan Agama Islam', 'author' => 'Kemendikbud', 'publisher' => 'Erlangga', 'year' => 2022, 'pages' => 190],
        ];

        $lastId = BookUnit::max('id') ?? 0;

        foreach ($books as $index => $book) {
            $isbn = '978-602-123-456-' . ($index + 1);

            $createdBook = Book::create([
                ...$book,
                'book_category_id' => $categories[array_rand($categories)],
                'slug'             => Str::slug($book['title']),
                'isbn'             => $isbn,
            ]);

            $units = [];
            for ($i = 0; $i < 5; $i++) {
                $nextId = $lastId + $i + 1;
                $units[] = [
                    'book_id'    => $createdBook->id,
                    'code'       => 'BU-' . date('dmY') . '-' . str_pad($nextId, 6, '0', STR_PAD_LEFT),
                    'condition'  => 'good',
                    'status'     => 'available',
                    'note'       => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            BookUnit::insert($units);
            $lastId += 5;
        }
    }
}