<?php

use App\Models\AcademicSession;
use App\Models\Course;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

function setupAttendanceScenario(): array
{
    $invigilator = makeInvigilator();
    $token = $invigilator->user->createToken('mobile', ['invigilator'])->plainTextToken;

    $student = completeStudentThroughStep4();
    $student->update(['onboarding_step' => 5, 'onboarding_completed_at' => now()]);

    AcademicSession::query()->update(['is_active' => false]);
    $session = AcademicSession::create(['name' => '2040/2041', 'is_active' => true]);
    $semester = $session->semesters()->create(['name' => 'First', 'is_active' => true]);

    $course = Course::create([
        'department_id' => $student->department_id,
        'level' => $student->level,
        'code' => 'TD401',
        'title' => 'Attendance Test Course',
        'unit' => 3,
    ]);

    $student->courseRegistrations()->create([
        'course_id' => $course->id,
        'academic_session_id' => $session->id,
        'semester_id' => $semester->id,
        'registered_at' => now(),
    ]);

    return compact('invigilator', 'token', 'student', 'session', 'semester', 'course');
}

it('lists active-semester courses and their registered onboarded students', function () {
    $scenario = setupAttendanceScenario();

    $this->withHeader('Authorization', "Bearer {$scenario['token']}")
        ->getJson(route('api.invigilator.courses.index'))
        ->assertOk()
        ->assertJsonFragment(['code' => 'TD401']);

    $response = $this->withHeader('Authorization', "Bearer {$scenario['token']}")
        ->getJson(route('api.invigilator.courses.students', $scenario['course']));

    $response->assertOk();
    $response->assertJsonFragment(['matric_number' => $scenario['student']->user->matric_number]);
});

it('returns a match score from the face-service and does not persist an attendance row on check', function () {
    Http::fake([
        '*/descriptor' => Http::response([
            'success' => true,
            'descriptor' => array_fill(0, 128, 0.1),
        ]),
    ]);

    $scenario = setupAttendanceScenario();
    $scenario['student']->update(['face_descriptor' => array_fill(0, 128, 0.1)]);

    $response = $this->withHeader('Authorization', "Bearer {$scenario['token']}")
        ->postJson(route('api.invigilator.attendances.check'), [
            'student_id' => $scenario['student']->id,
            'course_id' => $scenario['course']->id,
            'photo' => UploadedFile::fake()->image('capture.jpg'),
        ]);

    $response->assertOk();
    $response->assertJson(['is_match' => true]);
    expect((float) $response->json('match_score'))->toBe(100.0);
    expect(\App\Models\Attendance::count())->toBe(0);
});

it('reports a mismatch when the captured descriptor is far from the stored one', function () {
    Http::fake([
        '*/descriptor' => Http::response([
            'success' => true,
            'descriptor' => array_fill(0, 128, 5.0),
        ]),
    ]);

    $scenario = setupAttendanceScenario();
    $scenario['student']->update(['face_descriptor' => array_fill(0, 128, 0.1)]);

    $response = $this->withHeader('Authorization', "Bearer {$scenario['token']}")
        ->postJson(route('api.invigilator.attendances.check'), [
            'student_id' => $scenario['student']->id,
            'course_id' => $scenario['course']->id,
            'photo' => UploadedFile::fake()->image('capture.jpg'),
        ]);

    $response->assertOk();
    $response->assertJson(['is_match' => false]);
});

it('surfaces a no-face-detected error from the face-service as a 422', function () {
    Http::fake([
        '*/descriptor' => Http::response(['success' => false, 'message' => 'No face detected in the captured photo.'], 422),
    ]);

    $scenario = setupAttendanceScenario();

    $this->withHeader('Authorization', "Bearer {$scenario['token']}")
        ->postJson(route('api.invigilator.attendances.check'), [
            'student_id' => $scenario['student']->id,
            'course_id' => $scenario['course']->id,
            'photo' => UploadedFile::fake()->image('capture.jpg'),
        ])->assertUnprocessable();
});

it('commits an attendance record with the invigilator-chosen status', function () {
    Storage::fake('public');

    $scenario = setupAttendanceScenario();

    $response = $this->withHeader('Authorization', "Bearer {$scenario['token']}")
        ->postJson(route('api.invigilator.attendances.store'), [
            'student_id' => $scenario['student']->id,
            'course_id' => $scenario['course']->id,
            'status' => 'matched',
            'match_score' => 92.5,
            'photo' => UploadedFile::fake()->image('capture.jpg'),
        ]);

    $response->assertCreated();

    $attendance = \App\Models\Attendance::first();
    expect($attendance)->not->toBeNull();
    expect($attendance->status->value)->toBe('matched');
    expect((float) $attendance->match_score)->toBe(92.5);
    expect($attendance->invigilator_id)->toBe($scenario['invigilator']->user->id);
    Storage::disk('public')->assertExists($attendance->captured_photo_path);
});

it('allows marking a student absent without a photo', function () {
    $scenario = setupAttendanceScenario();

    $this->withHeader('Authorization', "Bearer {$scenario['token']}")
        ->postJson(route('api.invigilator.attendances.store'), [
            'student_id' => $scenario['student']->id,
            'course_id' => $scenario['course']->id,
            'status' => 'absent',
        ])->assertCreated();

    expect(\App\Models\Attendance::first()->status->value)->toBe('absent');
});
