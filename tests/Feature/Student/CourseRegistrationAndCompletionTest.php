<?php

use App\Models\AcademicSession;
use App\Models\Course;

function completeStudentThroughStep4(): \App\Models\Student
{
    $student = makeStudent();
    $student->user->update(['must_change_password' => false]);
    $student->update([
        'onboarding_step' => 4,
        'passport_photo_path' => 'students/passports/example.jpg',
        'face_descriptor' => array_fill(0, 128, 0.1),
    ]);

    return $student;
}

it('lets a student register for courses matching their department and level', function () {
    $student = completeStudentThroughStep4();

    AcademicSession::query()->update(['is_active' => false]);
    $session = AcademicSession::create(['name' => '2030/2031', 'is_active' => true]);
    $semester = $session->semesters()->create(['name' => 'First', 'is_active' => true]);

    $course1 = Course::create(['department_id' => $student->department_id, 'level' => $student->level, 'code' => 'TD201', 'title' => 'Course One', 'unit' => 3]);
    $course2 = Course::create(['department_id' => $student->department_id, 'level' => $student->level, 'code' => 'TD202', 'title' => 'Course Two', 'unit' => 2]);
    // A course in a different level should not be selectable.
    $wrongLevelCourse = Course::create(['department_id' => $student->department_id, 'level' => $student->level + 100, 'code' => 'TD301', 'title' => 'Course Three', 'unit' => 3]);

    $response = $this->actingAs($student->user)->post(route('student.onboarding.step5.store'), [
        'course_ids' => [$course1->id, $course2->id],
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('student.onboarding.show', ['step' => 6]));

    $student->refresh();
    expect($student->onboarding_step)->toBe(5);
    expect($student->courseRegistrations()->pluck('course_id')->sort()->values()->all())->toBe([$course1->id, $course2->id]);
    expect($student->courseRegistrations()->where('academic_session_id', $session->id)->where('semester_id', $semester->id)->count())->toBe(2);

    $this->actingAs($student->user)
        ->post(route('student.onboarding.step5.store'), ['course_ids' => [$wrongLevelCourse->id]])
        ->assertSessionHasErrors('course_ids.0');
});

it('completes onboarding after the print step and redirects future visits to the dashboard', function () {
    $student = completeStudentThroughStep4();
    $student->update(['onboarding_step' => 5]);

    $this->actingAs($student->user)->get(route('student.onboarding.show', ['step' => 6]))->assertOk();

    $response = $this->actingAs($student->user)->post(route('student.onboarding.complete'));
    $response->assertRedirect(route('student.dashboard'));

    $student->refresh();
    expect($student->onboarding_completed_at)->not->toBeNull();
    expect($student->hasCompletedOnboarding())->toBeTrue();

    $this->actingAs($student->user)
        ->get(route('student.onboarding.show', ['step' => 6]))
        ->assertRedirect(route('student.dashboard'));

    $this->actingAs($student->user)->get(route('student.dashboard'))->assertOk();
});
