<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCourseRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'department_id' => ['required', 'exists:departments,id'],
            'level' => ['required', 'integer', 'in:100,200,300,400,500'],
            'code' => [
                'required', 'string', 'max:20',
                Rule::unique('courses')
                    ->where(fn ($query) => $query->where('department_id', $this->input('department_id')))
                    ->ignore($this->route('course')),
            ],
            'title' => ['required', 'string', 'max:255'],
            'unit' => ['nullable', 'integer', 'min:1', 'max:10'],
        ];
    }
}
