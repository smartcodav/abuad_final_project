<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\FaceCaptureRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class FaceCaptureController extends Controller
{
    public function store(FaceCaptureRequest $request): RedirectResponse
    {
        $student = $request->user()->student;

        abort_unless($student->onboarding_step >= 3, 403);

        $path = $request->file('photo')->store('students/passports', 'public');

        $student->update([
            'passport_photo_path' => $path,
            'face_descriptor' => array_map('floatval', $request->validated('descriptor')),
        ]);

        if ($student->onboarding_step < 4) {
            $student->update(['onboarding_step' => 4]);
        }

        return to_route('student.onboarding.show', ['step' => 5]);
    }
}
