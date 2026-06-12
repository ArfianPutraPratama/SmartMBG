<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SppgFoodWaste extends Model
{
    protected $fillable = [
        'jenis_makanan',
        'berat',
        'waktu_input',
        'lokasi',
        'lat',
        'lng',
        'keterangan',
        'image_path',
        'status',
        'mitra_id',
        'sppg_username'
    ];
}
