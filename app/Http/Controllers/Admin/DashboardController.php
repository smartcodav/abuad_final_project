<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicSession;
use App\Models\Course;
use App\Models\Department;
use App\Models\Invigilator;
use App\Models\School;
use App\Models\Student;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'schools' => School::count(),
                'departments' => Department::count(),
                'students' => Student::count(),
                'invigilators' => Invigilator::count(),
                'courses' => Course::count(),
                'activeSession' => AcademicSession::where('is_active', true)->value('name'),
            ],
        ]);
    }
}
