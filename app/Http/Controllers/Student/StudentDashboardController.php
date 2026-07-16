<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentDashboardController extends Controller
{
    public function show(Request $request): Response
    {
        $student = $request->user()->student()->with('department.school')->first();

        return Inertia::render('student/dashboard', [
            'student' => [
                'name' => $request->user()->name,
                'matricNumber' => $request->user()->matric_number,
                'department' => $student->department->name,
                'school' => $student->department->school->name,
                'level' => $student->level,
            ],
        ]);
    }
}
