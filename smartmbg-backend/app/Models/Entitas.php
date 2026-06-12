<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entitas extends Model
{
    protected $fillable = [
        'nama', 'tipe', 'status_mbg', 'alamat', 'catatan', 'lat', 'lng'
    ];
}
