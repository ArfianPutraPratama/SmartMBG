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
        Schema::create('laporan_mitras', function (Blueprint $table) {
            $table->id();
            $table->string('batch_id');
            $table->date('tanggal_operasional');
            $table->string('hasil_olahan');
            $table->decimal('volume', 8, 2);
            $table->decimal('harga', 10, 2);
            $table->text('catatan')->nullable();
            $table->string('status')->default('diproses');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_mitras');
    }
};
