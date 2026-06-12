<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanMitra extends Model
{
    use HasFactory;

    protected $fillable = [
        'batch_id',
        'tanggal_operasional',
        'hasil_olahan',
        'volume',
        'harga',
        'catatan',
        'status',
    ];
}
