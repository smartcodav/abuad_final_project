<?php

use App\Http\Controllers\Admin\AcademicSessionController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\InvigilatorController;
use App\Http\Controllers\Admin\SchoolController;
use App\Http\Controllers\Admin\SemesterController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\StudentImportController;
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

    Route::get('students', [StudentController::class, 'index'])->name('students.index');
    Route::get('students/{student}', [StudentController::class, 'show'])->name('students.show');
    Route::post('students/{student}/reset-password', [StudentController::class, 'resetPassword'])->name('students.reset-password');
    Route::get('students-import', [StudentImportController::class, 'create'])->name('students.import.create');
    Route::post('students-import', [StudentImportController::class, 'store'])->name('students.import.store');
    Route::get('students-import/template', [StudentImportController::class, 'template'])->name('students.import.template');
});
