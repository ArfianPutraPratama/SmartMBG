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
        Schema::create('nutrition_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->json('menu_terdeteksi')->nullable();
            $table->string('porsi')->default('Besar');
            $table->decimal('kalori', 8, 2)->default(0);
            $table->decimal('protein', 8, 2)->default(0);
            $table->decimal('lemak', 8, 2)->default(0);
            $table->decimal('karbo', 8, 2)->default(0);
            $table->decimal('serat', 8, 2)->default(0);
            $table->decimal('vitamin_mineral', 8, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nutrition_histories');
    }
};
