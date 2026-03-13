<?php

namespace App\Http\Requests\Admin\Users;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class BulkActionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('edit users') || $this->user()?->can('delete users');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'action' => ['required', 'string', 'in:delete,restore,ban,unban,assign-role,reorder'],
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:users,id'],
            'role' => ['required_if:action,assign-role', 'nullable', 'string', 'exists:roles,name'],
        ];
    }
}
