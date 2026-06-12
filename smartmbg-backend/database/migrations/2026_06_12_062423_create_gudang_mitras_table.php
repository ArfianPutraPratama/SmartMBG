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
        Schema::create('gudang_mitras', function (Blueprint $table) {
            $table->id();
            $table->decimal('terisi', 8, 2)->default(0);
            $table->decimal('kapasitas_maksimal', 8, 2)->default(10);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gudang_mitras');
    }
};
