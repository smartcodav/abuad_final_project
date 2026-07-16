<?php

namespace App\Http\Requests\Api\Invigilator;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AttendanceStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'status' => ['required', Rule::in(['matched', 'mismatch_confirmed', 'absent'])],
            'match_score' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'photo' => ['required_unless:status,absent', 'nullable', 'image', 'max:5120'],
        ];
    }
}
