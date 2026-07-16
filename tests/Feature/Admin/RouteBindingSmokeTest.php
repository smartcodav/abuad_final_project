<?php

use App\Enums\UserRole;
use App\Models\AcademicSession;
use App\Models\User;

it('resolves the academic session model correctly on the edit route', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $session = AcademicSession::create(['name' => '2099/2100', 'is_active' => false]);

    $response = $this->actingAs($admin)->get(route('admin.academic-sessions.edit', $session));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->where('academicSession.id', $session->id)->where('academicSession.name', '2099/2100'));
});

it('allows updating an academic session while keeping its own name', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $session = AcademicSession::create(['name' => '2098/2099', 'is_active' => false]);

    $response = $this->actingAs($admin)->put(route('admin.academic-sessions.update', $session), [
        'name' => '2098/2099',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('admin.academic-sessions.index'));
});
