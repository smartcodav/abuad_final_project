<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSemesterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'academic_session_id' => ['required', 'exists:academic_sessions,id'],
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('semesters')->where(fn ($query) => $query->where('academic_session_id', $this->input('academic_session_id'))),
            ],
        ];
    }
}
