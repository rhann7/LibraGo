<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loan_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_request_id')->nullable()->constrained()->cascadeOnDelete();
            $table->enum('type', ['pickup', 'return']);
            $table->string('token', 8)->unique();
            $table->timestamp('expired_at');
            $table->timestamp('used_at')->nullable();
            $table->timestamps();

            $table->index(['loan_request_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loan_tokens');
    }
};