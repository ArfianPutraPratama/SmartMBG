<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NutritionHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'menu_terdeteksi',
        'porsi',
        'kalori',
        'protein',
        'lemak',
        'karbo',
        'serat',
        'vitamin_mineral'
    ];

    protected $casts = [
        'menu_terdeteksi' => 'array',
    ];
}
