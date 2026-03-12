<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('author')->nullable();
            $table->string('publisher')->nullable();
            $table->string('isbn')->unique()->nullable();
            $table->string('cover')->nullable();
            $table->year('year');
            $table->text('synopsis')->nullable();
            $table->unsignedInteger('pages')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};