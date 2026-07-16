<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('department_id')->constrained()->restrictOnDelete();
            $table->unsignedSmallInteger('level');
            $table->string('gender')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('exam_username')->nullable();
            $table->text('exam_password')->nullable();
            $table->string('passport_photo_path')->nullable();
            $table->json('face_descriptor')->nullable();
            $table->unsignedTinyInteger('onboarding_step')->default(0);
            $table->timestamp('onboarding_completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
