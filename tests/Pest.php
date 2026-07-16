<?php

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

pest()->extend(Tests\TestCase::class)
    ->use(Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function makeStudent(): App\Models\Student
{
    $school = App\Models\School::create(['name' => 'Test School '.uniqid(), 'code' => 'TS'.uniqid()]);
    $department = App\Models\Department::create(['school_id' => $school->id, 'name' => 'Test Department', 'code' => 'TD']);

    $user = App\Models\User::create([
        'name' => 'Test Student',
        'email' => 'test-student-'.uniqid().'@students.pending',
        'matric_number' => 'TD/2021/'.random_int(1000, 9999),
        'password' => Illuminate\Support\Facades\Hash::make('1234567'),
        'role' => App\Enums\UserRole::Student,
        'must_change_password' => true,
    ]);

    return $user->student()->create([
        'department_id' => $department->id,
        'level' => 200,
        'onboarding_step' => 0,
    ]);
}
