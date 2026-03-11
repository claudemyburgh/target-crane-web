<?php

namespace App\Http\Requests;

use App\Models\Trailer;
use Illuminate\Foundation\Http\FormRequest;

class TrailerFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $trailerId = $this->route('trailer');
        $trailerId = $trailerId instanceof Trailer ? $trailerId->id : $trailerId;

        return [
            'fleet_number' => [
                'required',
                'string',
                'max:255',
                'unique:trailers,fleet_number,'.$trailerId,
            ],
            'registration_number' => [
                'required',
                'string',
                'max:255',
                'unique:trailers,registration_number,'.$trailerId,
            ],
            'brand_name' => [
                'required',
                'string',
                'max:255',
            ],
            'axles_amount' => [
                'required',
                'integer',
                'min:1',
                'max:10',
            ],
            'license_expiry_date' => [
                'required',
                'date',
            ],
        ];
    }
}
