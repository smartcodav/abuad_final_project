<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDepartmentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('departments')
                    ->where(fn ($query) => $query->where('school_id', $this->input('school_id')))
                    ->ignore($this->route('department')),
            ],
            'code' => ['nullable', 'string', 'max:50'],
        ];
    }
}
