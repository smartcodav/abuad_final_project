<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSchoolRequest;
use App\Http\Requests\Admin\UpdateSchoolRequest;
use App\Models\School;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SchoolController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/schools/index', [
            'schools' => School::withCount('departments')->orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/schools/create');
    }

    public function store(StoreSchoolRequest $request): RedirectResponse
    {
        School::create($request->validated());

        return to_route('admin.schools.index');
    }

    public function edit(School $school): Response
    {
        return Inertia::render('admin/schools/edit', [
            'school' => $school,
        ]);
    }

    public function update(UpdateSchoolRequest $request, School $school): RedirectResponse
    {
        $school->update($request->validated());

        return to_route('admin.schools.index');
    }

    public function destroy(School $school): RedirectResponse
    {
        $school->delete();

        return to_route('admin.schools.index');
    }
}
