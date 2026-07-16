<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

it('issues a token for a valid invigilator login', function () {
    $invigilator = makeInvigilator('correct-password');

    $response = $this->postJson(route('api.invigilator.login'), [
        'email' => $invigilator->user->email,
        'password' => 'correct-password',
    ]);

    $response->assertOk();
    $response->assertJsonStructure(['token', 'user' => ['id', 'name', 'email']]);
});

it('rejects an invigilator login with the wrong password', function () {
    $invigilator = makeInvigilator('correct-password');

    $this->postJson(route('api.invigilator.login'), [
        'email' => $invigilator->user->email,
        'password' => 'wrong-password',
    ])->assertUnprocessable();
});

it('rejects login for a non-invigilator user even with correct credentials', function () {
    $student = User::factory()->create(['role' => UserRole::Student, 'password' => Hash::make('correct-password')]);

    $this->postJson(route('api.invigilator.login'), [
        'email' => $student->email,
        'password' => 'correct-password',
    ])->assertUnprocessable();
});

it('rejects unauthenticated access to protected invigilator endpoints', function () {
    $this->getJson(route('api.invigilator.courses.index'))->assertUnauthorized();
});

it('lets an authenticated invigilator fetch their profile', function () {
    $invigilator = makeInvigilator();
    $token = $invigilator->user->createToken('mobile', ['invigilator'])->plainTextToken;

    $this->withHeader('Authorization', "Bearer {$token}")
        ->getJson(route('api.invigilator.me'))
        ->assertOk()
        ->assertJson(['email' => $invigilator->user->email]);
});

it('deletes the current access token on logout', function () {
    $invigilator = makeInvigilator();
    $tokenResult = $invigilator->user->createToken('mobile', ['invigilator']);

    expect(\Laravel\Sanctum\PersonalAccessToken::count())->toBe(1);

    $this->withHeader('Authorization', "Bearer {$tokenResult->plainTextToken}")
        ->postJson(route('api.invigilator.logout'))
        ->assertOk();

    expect(\Laravel\Sanctum\PersonalAccessToken::count())->toBe(0);
});
