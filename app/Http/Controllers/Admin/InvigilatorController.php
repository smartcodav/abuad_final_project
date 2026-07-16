<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreInvigilatorRequest;
use App\Http\Requests\Admin\UpdateInvigilatorRequest;
use App\Models\Invigilator;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class InvigilatorController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/invigilators/index', [
            'invigilators' => Invigilator::with('user')->orderByDesc('id')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/invigilators/create');
    }

    public function store(StoreInvigilatorRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->validated('name'),
                'email' => $request->validated('email'),
                'password' => Hash::make($request->validated('password')),
                'role' => UserRole::Invigilator,
            ]);

            $user->invigilator()->create([
                'phone' => $request->validated('phone'),
            ]);
        });

        return to_route('admin.invigilators.index');
    }

    public function edit(Invigilator $invigilator): Response
    {
        return Inertia::render('admin/invigilators/edit', [
            'invigilator' => $invigilator->load('user'),
        ]);
    }

    public function update(UpdateInvigilatorRequest $request, Invigilator $invigilator): RedirectResponse
    {
        DB::transaction(function () use ($request, $invigilator) {
            $invigilator->user->update([
                'name' => $request->validated('name'),
                'email' => $request->validated('email'),
                ...($request->validated('password') ? ['password' => Hash::make($request->validated('password'))] : []),
            ]);

            $invigilator->update([
                'phone' => $request->validated('phone'),
            ]);
        });

        return to_route('admin.invigilators.index');
    }

    public function destroy(Invigilator $invigilator): RedirectResponse
    {
        $invigilator->user()->delete();
        $invigilator->delete();

        return to_route('admin.invigilators.index');
    }
}
