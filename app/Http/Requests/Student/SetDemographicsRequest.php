<?php

namespace App\Http\Requests\Student;

use App\Enums\Gender;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class SetDemographicsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'gender' => ['required', new Enum(Gender::class)],
            'date_of_birth' => ['required', 'date', 'before:today'],
        ];
    }
}
