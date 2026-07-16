<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSchoolRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('schools', 'name')->ignore($this->route('school'))],
            'code' => ['nullable', 'string', 'max:50', Rule::unique('schools', 'code')->ignore($this->route('school'))],
        ];
    }
}
