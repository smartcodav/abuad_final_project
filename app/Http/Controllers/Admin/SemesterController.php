<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSemesterRequest;
use App\Http\Requests\Admin\UpdateSemesterRequest;
use App\Models\AcademicSession;
use App\Models\Semester;
use App\Services\AcademicSessionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SemesterController extends Controller
{
    public function __construct(private readonly AcademicSessionService $academicSessionService) {}

    public function index(): Response
    {
        return Inertia::render('admin/semesters/index', [
            'semesters' => Semester::with('academicSession')->orderByDesc('id')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/semesters/create', [
            'academicSessions' => AcademicSession::orderByDesc('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreSemesterRequest $request): RedirectResponse
    {
        Semester::create($request->validated());

        return to_route('admin.semesters.index');
    }

    public function edit(Semester $semester): Response
    {
        return Inertia::render('admin/semesters/edit', [
            'semester' => $semester,
            'academicSessions' => AcademicSession::orderByDesc('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateSemesterRequest $request, Semester $semester): RedirectResponse
    {
        $semester->update($request->validated());

        return to_route('admin.semesters.index');
    }

    public function destroy(Semester $semester): RedirectResponse
    {
        $semester->delete();

        return to_route('admin.semesters.index');
    }

    public function activate(Semester $semester): RedirectResponse
    {
        $this->academicSessionService->activateSemester($semester);

        return to_route('admin.semesters.index');
    }
}
