<?php

use App\Enums\UserRole;
use App\Models\Department;
use App\Models\School;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

function makeStudent(): Student
{
    $school = School::create(['name' => 'Test School', 'code' => 'TS']);
    $department = Department::create(['school_id' => $school->id, 'name' => 'Test Department', 'code' => 'TD']);

    $user = User::create([
        'name' => 'Test Student',
        'email' => 'test-student@students.pending',
        'matric_number' => 'TD/2021/999',
        'password' => Hash::make('1234567'),
        'role' => UserRole::Student,
        'must_change_password' => true,
    ]);

    return $user->student()->create([
        'department_id' => $department->id,
        'level' => 200,
        'onboarding_step' => 0,
    ]);
}

it('logs a student in with matric number and forces a password change', function () {
    $student = makeStudent();

    $response = $this->post(route('student.login'), [
        'matric_number' => $student->user->matric_number,
        'password' => '1234567',
    ]);

    $response->assertRedirect(route('student.home'));
    $this->assertAuthenticatedAs($student->user);

    $response = $this->get(route('student.home'));
    $response->assertRedirect(route('student.password.change'));
});

it('rejects a login with the wrong password', function () {
    $student = makeStudent();

    $this->post(route('student.login'), [
        'matric_number' => $student->user->matric_number,
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('matric_number');

    $this->assertGuest();
});

it('requires the password to be changed before reaching onboarding', function () {
    $student = makeStudent();

    $this->actingAs($student->user)
        ->get(route('student.onboarding.show', ['step' => 1]))
        ->assertRedirect(route('student.password.change'));
});

it('lets the student change the default password and then reach onboarding step 1', function () {
    $student = makeStudent();

    $response = $this->actingAs($student->user)->put(route('student.password.update'), [
        'password' => 'NewSecurePass123',
        'password_confirmation' => 'NewSecurePass123',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('student.home'));

    expect($student->user->fresh()->must_change_password)->toBeFalse();
    expect(Hash::check('NewSecurePass123', $student->user->fresh()->password))->toBeTrue();

    $this->get(route('student.home'))->assertRedirect(route('student.onboarding.show', ['step' => 1]));
});

it('walks through onboarding steps 1 to 3 in order and persists progress', function () {
    $student = makeStudent();
    $student->user->update(['must_change_password' => false]);

    $this->actingAs($student->user);

    // Step 1: confirm identity
    $this->get(route('student.onboarding.show', ['step' => 1]))->assertOk();
    $this->post(route('student.onboarding.step1.store'))->assertRedirect(route('student.onboarding.show', ['step' => 2]));
    expect($student->fresh()->onboarding_step)->toBe(1);

    // Cannot skip ahead to step 3 yet — should be redirected back to step 2
    $this->get(route('student.onboarding.show', ['step' => 3]))->assertRedirect(route('student.onboarding.show', ['step' => 2]));

    // Step 2: set email
    $this->post(route('student.onboarding.step2.store'), [
        'email' => 'student@example.com',
    ])->assertRedirect(route('student.onboarding.show', ['step' => 3]));
    expect($student->fresh()->onboarding_step)->toBe(2);
    expect($student->user->fresh()->email)->toBe('student@example.com');

    // Step 3: demographics
    $this->post(route('student.onboarding.step3.store'), [
        'gender' => 'male',
        'date_of_birth' => '2000-01-01',
    ])->assertRedirect(route('student.onboarding.show', ['step' => 4]));
    expect($student->fresh()->onboarding_step)->toBe(3);
    expect($student->fresh()->gender->value)->toBe('male');
});

it('resumes onboarding at the correct step after logging back in', function () {
    $student = makeStudent();
    $student->user->update(['must_change_password' => false]);
    $student->update(['onboarding_step' => 2]);

    $this->actingAs($student->user);
    $this->get(route('student.home'))->assertRedirect(route('student.onboarding.show', ['step' => 3]));

    // simulate logout and log back in
    $this->post(route('student.logout'));
    $this->assertGuest();

    $this->post(route('student.login'), [
        'matric_number' => $student->user->matric_number,
        'password' => '1234567',
    ]);

    $this->get(route('student.home'))->assertRedirect(route('student.onboarding.show', ['step' => 3]));
});

it('rejects setting an email that is already taken', function () {
    $student = makeStudent();
    $student->user->update(['must_change_password' => false]);
    $student->update(['onboarding_step' => 1]);

    User::factory()->create(['email' => 'taken@example.com']);

    $this->actingAs($student->user)
        ->post(route('student.onboarding.step2.store'), ['email' => 'taken@example.com'])
        ->assertSessionHasErrors('email');
});
