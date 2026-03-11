<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Trailer extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'fleet_number',
        'registration_number',
        'brand_name',
        'axles_amount',
        'license_expiry_date',
    ];

    protected function casts(): array
    {
        return [
            'license_expiry_date' => 'date',
        ];
    }
}
