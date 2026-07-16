<?php

namespace App\Http\Requests\Student;

use App\Models\Course;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CourseRegistrationRequest extends FormRequest
{
    public function rules(): array
    {
        $student = $this->user()->student;

        return [
            'course_ids' => ['required', 'array', 'min:1'],
            'course_ids.*' => [
                'integer',
                Rule::exists(Course::class, 'id')
                    ->where('department_id', $student->department_id)
                    ->where('level', $student->level),
            ],
        ];
    }
}
