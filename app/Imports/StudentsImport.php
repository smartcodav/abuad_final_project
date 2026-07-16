<?php

namespace App\Imports;

use App\Enums\UserRole;
use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class StudentsImport implements SkipsOnFailure, ToModel, WithHeadingRow, WithValidation
{
    use Importable, SkipsFailures;

    public int $importedCount = 0;

    public function model(array $row): ?Model
    {
        $department = $this->resolveDepartment((string) $row['department']);
        $matricNumber = trim((string) $row['matric_number']);
        $password = trim((string) ($row['default_password'] ?? '')) ?: '1234567';

        DB::transaction(function () use ($row, $department, $matricNumber, $password) {
            $user = User::create([
                'name' => trim((string) $row['full_name']),
                'email' => Str::slug($matricNumber).'@students.pending',
                'matric_number' => $matricNumber,
                'password' => Hash::make($password),
                'role' => UserRole::Student,
                'must_change_password' => true,
            ]);

            $user->student()->create([
                'department_id' => $department->id,
                'level' => (int) $row['level'],
                'exam_username' => $row['exam_username'] ?? null,
                'exam_password' => $row['exam_password'] ?? null,
                'onboarding_step' => 0,
            ]);
        });

        $this->importedCount++;

        return null;
    }

    public function rules(): array
    {
        return [
            'matric_number' => ['required', 'string', 'max:50', 'unique:users,matric_number'],
            'full_name' => ['required', 'string', 'max:255'],
            'department' => [
                'required',
                'string',
                function (string $attribute, mixed $value, \Closure $fail) {
                    if (! $this->resolveDepartment((string) $value)) {
                        $fail("No department matches \"{$value}\".");
                    }
                },
            ],
            'level' => ['required', 'integer', 'in:100,200,300,400,500'],
            'default_password' => ['nullable', 'string', 'min:4'],
            'exam_username' => ['nullable', 'string', 'max:255'],
            'exam_password' => ['nullable', 'string', 'max:255'],
        ];
    }

    private function resolveDepartment(string $name): ?Department
    {
        return Department::whereRaw('LOWER(name) = ?', [Str::lower(trim($name))])->first();
    }
}
