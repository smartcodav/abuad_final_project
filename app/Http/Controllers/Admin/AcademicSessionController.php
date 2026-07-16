<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAcademicSessionRequest;
use App\Http\Requests\Admin\UpdateAcademicSessionRequest;
use App\Models\AcademicSession;
use App\Services\AcademicSessionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AcademicSessionController extends Controller
{
    public function __construct(private readonly AcademicSessionService $academicSessionService) {}

    public function index(): Response
    {
        return Inertia::render('admin/academic-sessions/index', [
            'academicSessions' => AcademicSession::with('semesters')->orderByDesc('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/academic-sessions/create');
    }

    public function store(StoreAcademicSessionRequest $request): RedirectResponse
    {
        AcademicSession::create($request->validated());

        return to_route('admin.academic-sessions.index');
    }

    public function edit(AcademicSession $academicSession): Response
    {
        return Inertia::render('admin/academic-sessions/edit', [
            'academicSession' => $academicSession,
        ]);
    }

    public function update(UpdateAcademicSessionRequest $request, AcademicSession $academicSession): RedirectResponse
    {
        $academicSession->update($request->validated());

        return to_route('admin.academic-sessions.index');
    }

    public function destroy(AcademicSession $academicSession): RedirectResponse
    {
        $academicSession->delete();

        return to_route('admin.academic-sessions.index');
    }

    public function activate(AcademicSession $academicSession): RedirectResponse
    {
        $this->academicSessionService->activateSession($academicSession);

        return to_route('admin.academic-sessions.index');
    }
}
