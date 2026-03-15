<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrailerLoadedReportFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'loads' => ['required', 'array', 'min:1'],
            'loads.*.fleet_number' => ['required', 'string'],
            'loads.*.registration_number' => ['required', 'string'],
            'loads.*.loaded' => ['nullable', 'string'],
            'loads.*.location' => ['nullable', 'string'],
            'loads.*.comment' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'loads.*.fleet_number.required' => 'The fleet number is required for each load.',
            'loads.*.registration_number.required' => 'The registration number is required for each load.',
        ];
    }
}
