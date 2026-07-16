<?php

use App\Http\Controllers\Admin\AcademicSessionController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\InvigilatorController;
use App\Http\Controllers\Admin\SchoolController;
use App\Http\Controllers\Admin\SemesterController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('schools', SchoolController::class)->except(['show']);
    Route::resource('departments', DepartmentController::class)->except(['show']);
    Route::resource('academic-sessions', AcademicSessionController::class)->except(['show']);
    Route::post('academic-sessions/{academicSession}/activate', [AcademicSessionController::class, 'activate'])->name('academic-sessions.activate');
    Route::resource('semesters', SemesterController::class)->except(['show']);
    Route::post('semesters/{semester}/activate', [SemesterController::class, 'activate'])->name('semesters.activate');
    Route::resource('invigilators', InvigilatorController::class)->except(['show']);
    Route::resource('courses', CourseController::class)->except(['show']);
});
