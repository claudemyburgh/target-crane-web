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

    public function getRouteKey(): string
    {
        return $this->date->format('Y-m-d');
    }

    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return static::whereDate('date', $value)->first();
    }
}
