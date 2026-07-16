<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StudentDashboardController extends Controller
{
    public function show(Request $request): Response
    {
        $student = $request->user()->student()->with(['department.school', 'courseRegistrations.course'])->first();

        return Inertia::render('student/dashboard', [
            'student' => [
                'name' => $request->user()->name,
                'matricNumber' => $request->user()->matric_number,
                'department' => $student->department->name,
                'school' => $student->department->school->name,
                'level' => $student->level,
                'photoUrl' => $student->passport_photo_path ? Storage::url($student->passport_photo_path) : null,
            ],
            'courses' => $student->courseRegistrations->map(fn ($registration) => [
                'id' => $registration->course->id,
                'code' => $registration->course->code,
                'title' => $registration->course->title,
                'unit' => $registration->course->unit,
            ]),
        ]);
    }
}
