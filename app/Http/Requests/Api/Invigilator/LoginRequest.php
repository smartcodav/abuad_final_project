<?php

namespace App\Http\Requests\Api\Invigilator;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * @throws ValidationException
     */
    public function authenticatedUser(): User
    {
        $user = User::where('email', $this->string('email'))->first();

        $validCredentials = $user && Auth::guard('web')->getProvider()->validateCredentials($user, ['password' => $this->string('password')]);

        if (! $validCredentials || $user->role !== UserRole::Invigilator) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        return $user;
    }
}
