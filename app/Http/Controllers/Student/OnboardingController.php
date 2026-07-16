<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\CourseRegistrationRequest;
use App\Http\Requests\Student\SetDemographicsRequest;
use App\Http\Requests\Student\SetEmailRequest;
use App\Models\AcademicSession;
use App\Models\Course;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    public function show(Request $request, int $step): Response
    {
        $student = $request->user()->student()->with(['user', 'department.school'])->first();

        return match ($step) {
            1 => Inertia::render('student/onboarding/step-1-confirm', [
                'fullName' => $student->user->name,
                'matricNumber' => $student->user->matric_number,
            ]),
            2 => Inertia::render('student/onboarding/step-2-email', [
                'email' => str_ends_with($student->user->email, '@students.pending') ? '' : $student->user->email,
            ]),
            3 => Inertia::render('student/onboarding/step-3-demographics', [
                'gender' => $student->gender,
                'dateOfBirth' => $student->date_of_birth?->format('Y-m-d'),
            ]),
            4 => Inertia::render('student/onboarding/step-4-face-capture'),
            5 => Inertia::render('student/onboarding/step-5-courses', [
                'courses' => Course::where('department_id', $student->department_id)
                    ->where('level', $student->level)
                    ->orderBy('code')
                    ->get(['id', 'code', 'title', 'unit']),
                'registeredCourseIds' => $student->courseRegistrations()->pluck('course_id'),
            ]),
            6 => Inertia::render('student/onboarding/step-6-print', [
                'student' => [
                    'name' => $student->user->name,
                    'matricNumber' => $student->user->matric_number,
                    'department' => $student->department->name,
                    'school' => $student->department->school->name,
                    'level' => $student->level,
                    'photoUrl' => $student->passport_photo_path ? Storage::url($student->passport_photo_path) : null,
                ],
            ]),
            default => abort(404),
        };
    }

    public function storeIdentityConfirmation(Request $request): RedirectResponse
    {
        $student = $request->user()->student;

        $this->ensurePriorStepsCompleted($student, requiredStep: 0);
        $this->advance($student, 1);

        return to_route('student.onboarding.show', ['step' => 2]);
    }

    public function storeEmail(SetEmailRequest $request): RedirectResponse
    {
        $student = $request->user()->student;

        $this->ensurePriorStepsCompleted($student, requiredStep: 1);

        $request->user()->update(['email' => $request->validated('email')]);
        $this->advance($student, 2);

        return to_route('student.onboarding.show', ['step' => 3]);
    }

    public function storeDemographics(SetDemographicsRequest $request): RedirectResponse
    {
        $student = $request->user()->student;

        $this->ensurePriorStepsCompleted($student, requiredStep: 2);

        $student->update([
            'gender' => $request->validated('gender'),
            'date_of_birth' => $request->validated('date_of_birth'),
        ]);
        $this->advance($student, 3);

        return to_route('student.onboarding.show', ['step' => 4]);
    }

    public function storeCourseRegistration(CourseRegistrationRequest $request): RedirectResponse
    {
        $student = $request->user()->student;

        $this->ensurePriorStepsCompleted($student, requiredStep: 4);

        $session = AcademicSession::where('is_active', true)->first();
        $semester = $session?->activeSemester();

        abort_if(! $session || ! $semester, 500, 'No active academic session/semester is configured.');

        DB::transaction(function () use ($request, $student, $session, $semester) {
            $student->courseRegistrations()->delete();

            foreach ($request->validated('course_ids') as $courseId) {
                $student->courseRegistrations()->create([
                    'course_id' => $courseId,
                    'academic_session_id' => $session->id,
                    'semester_id' => $semester->id,
                    'registered_at' => now(),
                ]);
            }
        });

        $this->advance($student, 5);

        return to_route('student.onboarding.show', ['step' => 6]);
    }

    public function complete(Request $request): RedirectResponse
    {
        $student = $request->user()->student;

        $this->ensurePriorStepsCompleted($student, requiredStep: 5);

        if (! $student->onboarding_completed_at) {
            $student->update(['onboarding_completed_at' => now()]);
        }

        return to_route('student.dashboard');
    }

    private function ensurePriorStepsCompleted(Student $student, int $requiredStep): void
    {
        abort_unless($student->onboarding_step >= $requiredStep, 403);
    }

    private function advance(Student $student, int $completedStep): void
    {
        if ($student->onboarding_step < $completedStep) {
            $student->update(['onboarding_step' => $completedStep]);
        }
    }
}
