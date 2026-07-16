<?php

use App\Enums\UserRole;
use App\Models\Department;
use App\Models\School;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;

function csvUpload(string $contents): UploadedFile
{
    return UploadedFile::fake()->createWithContent('students.csv', $contents);
}

it('imports valid rows and reports failures for invalid ones', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $school = School::create(['name' => 'College of Computing', 'code' => 'CCC']);
    Department::create(['school_id' => $school->id, 'name' => 'Computer Science', 'code' => 'CSC']);

    $csv = implode("\n", [
        'matric_number,full_name,department,level,default_password,exam_username,exam_password',
        'CSC/2021/001,Jane Doe,Computer Science,200,,jane.doe,examPass1',
        'CSC/2021/002,John Smith,Nonexistent Department,200,,john.smith,examPass2',
        'CSC/2021/001,Duplicate Matric,Computer Science,200,,dupe,dupe',
    ]);

    $response = $this->actingAs($admin)->post(route('admin.students.import.store'), [
        'file' => csvUpload($csv),
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('admin.students.index'));

    $result = session('importResult');
    expect($result['imported'])->toBe(1);
    expect($result['failures'])->toHaveCount(2);

    $user = User::where('matric_number', 'CSC/2021/001')->firstOrFail();
    expect($user->role)->toBe(UserRole::Student);
    expect($user->must_change_password)->toBeTrue();
    expect(Hash::check('1234567', $user->password))->toBeTrue();

    $student = Student::where('user_id', $user->id)->firstOrFail();
    expect($student->level)->toBe(200);
    expect($student->exam_username)->toBe('jane.doe');
    expect($student->exam_password)->toBe('examPass1');
    expect($student->onboarding_step)->toBe(0);

    expect(User::where('matric_number', 'CSC/2021/002')->exists())->toBeFalse();
});

it('respects a custom default password when provided', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $school = School::create(['name' => 'College of Computing', 'code' => 'CCC2']);
    Department::create(['school_id' => $school->id, 'name' => 'Software Engineering', 'code' => 'SWE']);

    $csv = implode("\n", [
        'matric_number,full_name,department,level,default_password,exam_username,exam_password',
        'SWE/2022/001,Amaka Obi,Software Engineering,100,custompass1,amaka.o,examPassX',
    ]);

    $this->actingAs($admin)->post(route('admin.students.import.store'), [
        'file' => csvUpload($csv),
    ])->assertSessionHasNoErrors();

    $user = User::where('matric_number', 'SWE/2022/001')->firstOrFail();
    expect(Hash::check('custompass1', $user->password))->toBeTrue();
});
