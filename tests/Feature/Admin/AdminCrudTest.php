<?php

use App\Enums\UserRole;
use App\Models\AcademicSession;
use App\Models\Course;
use App\Models\Department;
use App\Models\Invigilator;
use App\Models\School;
use App\Models\Semester;
use App\Models\User;

function admin(): User
{
    return User::factory()->create(['role' => UserRole::Admin]);
}

it('lets an admin create, update, and delete a school', function () {
    $response = $this->actingAs(admin())->post(route('admin.schools.store'), [
        'name' => 'College of Engineering',
        'code' => 'COE',
    ]);
    $response->assertSessionHasNoErrors();
    $school = School::where('name', 'College of Engineering')->firstOrFail();

    $this->actingAs(admin())->put(route('admin.schools.update', $school), [
        'name' => 'College of Engineering Sciences',
        'code' => 'COE',
    ])->assertSessionHasNoErrors();

    expect($school->fresh()->name)->toBe('College of Engineering Sciences');

    $this->actingAs(admin())->delete(route('admin.schools.destroy', $school))->assertSessionHasNoErrors();
    expect(School::find($school->id))->toBeNull();
});

it('lets an admin create a department scoped to a school', function () {
    $school = School::create(['name' => 'College of Science', 'code' => 'COS']);

    $this->actingAs(admin())->post(route('admin.departments.store'), [
        'school_id' => $school->id,
        'name' => 'Physics',
        'code' => 'PHY',
    ])->assertSessionHasNoErrors();

    expect(Department::where('name', 'Physics')->where('school_id', $school->id)->exists())->toBeTrue();
});

it('rejects a duplicate department name within the same school', function () {
    $school = School::create(['name' => 'College of Arts', 'code' => 'COA']);
    Department::create(['school_id' => $school->id, 'name' => 'History', 'code' => 'HIS']);

    $this->actingAs(admin())->post(route('admin.departments.store'), [
        'school_id' => $school->id,
        'name' => 'History',
        'code' => 'HIS2',
    ])->assertSessionHasErrors('name');
});

it('activates a semester and its parent session, deactivating siblings', function () {
    $sessionA = AcademicSession::create(['name' => '2020/2021', 'is_active' => true]);
    $sessionB = AcademicSession::create(['name' => '2021/2022', 'is_active' => false]);
    $semesterA1 = Semester::create(['academic_session_id' => $sessionA->id, 'name' => 'First', 'is_active' => true]);
    $semesterB1 = Semester::create(['academic_session_id' => $sessionB->id, 'name' => 'First', 'is_active' => false]);

    $this->actingAs(admin())->post(route('admin.semesters.activate', $semesterB1))->assertSessionHasNoErrors();

    expect($sessionA->fresh()->is_active)->toBeFalse();
    expect($sessionB->fresh()->is_active)->toBeTrue();
    expect($semesterA1->fresh()->is_active)->toBeFalse();
    expect($semesterB1->fresh()->is_active)->toBeTrue();
});

it('lets an admin create an invigilator with login credentials', function () {
    $this->actingAs(admin())->post(route('admin.invigilators.store'), [
        'name' => 'Jane Invigilator',
        'email' => 'jane.invigilator@example.com',
        'password' => 'password123',
        'phone' => '08012345678',
    ])->assertSessionHasNoErrors();

    $user = User::where('email', 'jane.invigilator@example.com')->firstOrFail();
    expect($user->role)->toBe(UserRole::Invigilator);
    expect($user->invigilator)->not->toBeNull();
    expect(\Illuminate\Support\Facades\Hash::check('password123', $user->password))->toBeTrue();
});

it('lets an admin update an invigilator without changing the password when left blank', function () {
    $admin = admin();
    $this->actingAs($admin)->post(route('admin.invigilators.store'), [
        'name' => 'Sam Invigilator',
        'email' => 'sam.invigilator@example.com',
        'password' => 'originalpass',
        'phone' => null,
    ]);
    $user = User::where('email', 'sam.invigilator@example.com')->firstOrFail();
    $originalHash = $user->password;
    $invigilator = $user->invigilator;

    $this->actingAs($admin)->put(route('admin.invigilators.update', $invigilator), [
        'name' => 'Sam Invigilator Jr',
        'email' => 'sam.invigilator@example.com',
        'password' => '',
        'phone' => '08099999999',
    ])->assertSessionHasNoErrors();

    $user->refresh();
    expect($user->name)->toBe('Sam Invigilator Jr');
    expect($user->password)->toBe($originalHash);
});

it('lets an admin create a course scoped to a department and level', function () {
    $school = School::create(['name' => 'College of Law', 'code' => 'COL']);
    $department = Department::create(['school_id' => $school->id, 'name' => 'Law', 'code' => 'LAW']);

    $this->actingAs(admin())->post(route('admin.courses.store'), [
        'department_id' => $department->id,
        'level' => 100,
        'code' => 'LAW101',
        'title' => 'Introduction to Law',
        'unit' => 3,
    ])->assertSessionHasNoErrors();

    expect(Course::where('code', 'LAW101')->exists())->toBeTrue();
});

it('blocks a non-admin from accessing admin routes', function () {
    $student = User::factory()->create(['role' => UserRole::Student]);

    $this->actingAs($student)->get(route('admin.dashboard'))->assertForbidden();
});

it('blocks a guest from accessing admin routes', function () {
    $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
});
