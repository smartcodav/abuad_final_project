<?php

namespace App\Http\Requests\Api\Invigilator;

use Illuminate\Foundation\Http\FormRequest;

class AttendanceCheckRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'photo' => ['required', 'image', 'max:5120'],
        ];
    }
}
