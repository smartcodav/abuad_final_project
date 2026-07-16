<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/students/index', [
            'students' => Student::with(['user', 'department.school'])
                ->orderByDesc('id')
                ->get()
                ->map(fn (Student $student) => [
                    'id' => $student->id,
                    'matric_number' => $student->user->matric_number,
                    'name' => $student->user->name,
                    'department' => $student->department->name,
                    'school' => $student->department->school->name,
                    'level' => $student->level,
                    'onboarding_step' => $student->onboarding_step,
                    'onboarding_completed' => $student->hasCompletedOnboarding(),
                ]),
            'importResult' => session('importResult'),
        ]);
    }

    public function show(Student $student): Response
    {
        $student->load(['user', 'department.school', 'courseRegistrations.course']);

        return Inertia::render('admin/students/show', [
            'student' => $student,
        ]);
    }

    public function resetPassword(Student $student): RedirectResponse
    {
        $student->user->update([
            'password' => Hash::make('1234567'),
            'must_change_password' => true,
        ]);

        return back()->with('status', 'Password reset to default.');
    }
}
