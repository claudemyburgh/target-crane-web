<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrailerLoadedReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'loads',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'loads' => 'array',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'date';
    }
}
