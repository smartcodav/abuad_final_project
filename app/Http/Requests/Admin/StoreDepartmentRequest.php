<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDepartmentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('departments')->where(fn ($query) => $query->where('school_id', $this->input('school_id'))),
            ],
            'code' => ['nullable', 'string', 'max:50'],
        ];
    }
}
