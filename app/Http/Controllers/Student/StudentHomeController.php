<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class StudentHomeController extends Controller
{
    public function __invoke(): RedirectResponse
    {
        return to_route('student.dashboard');
    }
}
