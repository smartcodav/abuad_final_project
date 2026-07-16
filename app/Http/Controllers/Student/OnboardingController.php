<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\SetDemographicsRequest;
use App\Http\Requests\Student\SetEmailRequest;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    public function show(Request $request, int $step): Response
    {
        $student = $request->user()->student()->with('user')->first();

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
