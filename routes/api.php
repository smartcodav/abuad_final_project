<?php

use App\Http\Controllers\Api\Invigilator\AttendanceController;
use App\Http\Controllers\Api\Invigilator\AuthController;
use App\Http\Controllers\Api\Invigilator\CourseController;
use Illuminate\Support\Facades\Route;

Route::prefix('invigilator')->name('api.invigilator.')->group(function () {
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:6,1')->name('login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('me', [AuthController::class, 'me'])->name('me');

        Route::get('courses', [CourseController::class, 'index'])->name('courses.index');
        Route::get('courses/{course}/students', [CourseController::class, 'students'])->name('courses.students');

        Route::post('attendances/check', [AttendanceController::class, 'check'])->name('attendances.check');
        Route::post('attendances', [AttendanceController::class, 'store'])->name('attendances.store');
    });
});
