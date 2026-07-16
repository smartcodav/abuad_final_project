<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreSchoolRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:schools,name'],
            'code' => ['nullable', 'string', 'max:50', 'unique:schools,code'],
        ];
    }
}
