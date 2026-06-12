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
        Schema::create('food_wastes', function (Blueprint $table) {
            $table->id();
            $table->string('food_type'); // Jenis Makanan Sisa
            $table->decimal('weight', 8, 2); // Perkiraan Berat dalam KG
            $table->string('condition'); // Kondisi: Layak Konsumsi / Tidak Layak
            $table->string('location'); // Lokasi Sisa Makanan
            $table->text('notes')->nullable(); // Keterangan
            $table->string('status')->default('Tersedia'); // Status (Tersedia, Sudah Diambil)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('food_wastes');
    }
};
