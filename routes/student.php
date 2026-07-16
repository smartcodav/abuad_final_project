<?php

use App\Http\Controllers\Student\FaceCaptureController;
use App\Http\Controllers\Student\OnboardingController;
use App\Http\Controllers\Student\PasswordChangeController;
use App\Http\Controllers\Student\StudentAuthController;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Student\StudentHomeController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('student/login', [StudentAuthController::class, 'create'])->name('student.login');
    Route::post('student/login', [StudentAuthController::class, 'store']);
});

Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function () {
    Route::post('logout', [StudentAuthController::class, 'destroy'])->name('logout');

    Route::get('password/change', [PasswordChangeController::class, 'edit'])->name('password.change');
    Route::put('password/change', [PasswordChangeController::class, 'update'])->name('password.update');

    Route::middleware(['redirect.password-change', 'redirect.onboarding-step'])->group(function () {
        Route::get('/', StudentHomeController::class)->name('home');
        Route::get('dashboard', [StudentDashboardController::class, 'show'])->name('dashboard');

        Route::get('onboarding/{step}', [OnboardingController::class, 'show'])->whereNumber('step')->name('onboarding.show');
        Route::post('onboarding/step-1', [OnboardingController::class, 'storeIdentityConfirmation'])->name('onboarding.step1.store');
        Route::post('onboarding/step-2', [OnboardingController::class, 'storeEmail'])->name('onboarding.step2.store');
        Route::post('onboarding/step-3', [OnboardingController::class, 'storeDemographics'])->name('onboarding.step3.store');
        Route::post('onboarding/step-4', [FaceCaptureController::class, 'store'])->name('onboarding.step4.store');
        Route::post('onboarding/step-5', [OnboardingController::class, 'storeCourseRegistration'])->name('onboarding.step5.store');
        Route::post('onboarding/complete', [OnboardingController::class, 'complete'])->name('onboarding.complete');
    });
});
