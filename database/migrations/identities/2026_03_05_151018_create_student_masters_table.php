<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_masters', function (Blueprint $table) {
            $table->id();
            $table->string('nipd')->unique();
            $table->string('name');
            $table->string('class_name');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_masters');
    }
};