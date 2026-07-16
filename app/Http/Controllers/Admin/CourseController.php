<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCourseRequest;
use App\Http\Requests\Admin\UpdateCourseRequest;
use App\Models\Course;
use App\Models\Department;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/courses/index', [
            'courses' => Course::with('department.school')->orderBy('level')->orderBy('code')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/courses/create', [
            'departments' => Department::with('school')->orderBy('name')->get(),
        ]);
    }

    public function store(StoreCourseRequest $request): RedirectResponse
    {
        Course::create($request->validated());

        return to_route('admin.courses.index');
    }

    public function edit(Course $course): Response
    {
        return Inertia::render('admin/courses/edit', [
            'course' => $course,
            'departments' => Department::with('school')->orderBy('name')->get(),
        ]);
    }

    public function update(UpdateCourseRequest $request, Course $course): RedirectResponse
    {
        $course->update($request->validated());

        return to_route('admin.courses.index');
    }

    public function destroy(Course $course): RedirectResponse
    {
        $course->delete();

        return to_route('admin.courses.index');
    }
}
