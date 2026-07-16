<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectToOnboardingStep
{
    public function handle(Request $request, Closure $next): Response
    {
        $student = $request->user()->student;
        $isOnboardingRoute = $request->routeIs('student.onboarding.*');

        if ($student->hasCompletedOnboarding()) {
            return $isOnboardingRoute ? redirect()->route('student.dashboard') : $next($request);
        }

        $allowedStep = min($student->onboarding_step + 1, 6);

        if (! $isOnboardingRoute) {
            return redirect()->route('student.onboarding.show', ['step' => $allowedStep]);
        }

        $requestedStep = $request->route('step');

        if ($requestedStep !== null && (int) $requestedStep > $allowedStep) {
            return redirect()->route('student.onboarding.show', ['step' => $allowedStep]);
        }

        return $next($request);
    }
}
