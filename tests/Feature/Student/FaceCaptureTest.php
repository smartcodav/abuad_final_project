<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('stores the passport photo and face descriptor and advances onboarding', function () {
    Storage::fake('public');

    $student = makeStudent();
    $student->user->update(['must_change_password' => false]);
    $student->update(['onboarding_step' => 3]);

    $descriptor = array_fill(0, 128, 0.123456);

    $response = $this->actingAs($student->user)->post(route('student.onboarding.step4.store'), [
        'photo' => UploadedFile::fake()->image('passport.jpg'),
        'descriptor' => $descriptor,
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('student.onboarding.show', ['step' => 5]));

    $student->refresh();
    expect($student->onboarding_step)->toBe(4);
    expect($student->passport_photo_path)->not->toBeNull();
    expect($student->face_descriptor)->toHaveCount(128);
    expect(round($student->face_descriptor[0], 6))->toBe(0.123456);

    Storage::disk('public')->assertExists($student->passport_photo_path);
});

it('rejects a descriptor that is not exactly 128 numbers', function () {
    $student = makeStudent();
    $student->user->update(['must_change_password' => false]);
    $student->update(['onboarding_step' => 3]);

    $this->actingAs($student->user)->post(route('student.onboarding.step4.store'), [
        'photo' => UploadedFile::fake()->image('passport.jpg'),
        'descriptor' => array_fill(0, 50, 0.1),
    ])->assertSessionHasErrors('descriptor');
});

it('blocks face capture if earlier onboarding steps are not complete', function () {
    $student = makeStudent();
    $student->user->update(['must_change_password' => false]);
    $student->update(['onboarding_step' => 1]);

    $this->actingAs($student->user)->post(route('student.onboarding.step4.store'), [
        'photo' => UploadedFile::fake()->image('passport.jpg'),
        'descriptor' => array_fill(0, 128, 0.1),
    ])->assertForbidden();
});
