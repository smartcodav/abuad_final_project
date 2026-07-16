<?php

namespace Database\Seeders;

use App\Models\AcademicSession;
use Illuminate\Database\Seeder;

class AcademicSessionSeeder extends Seeder
{
    public function run(): void
    {
        $session = AcademicSession::firstOrCreate(
            ['name' => '2024/2025'],
            ['is_active' => true]
        );

        $session->semesters()->firstOrCreate(
            ['name' => 'First'],
            ['is_active' => true]
        );

        $session->semesters()->firstOrCreate(
            ['name' => 'Second'],
            ['is_active' => false]
        );
    }
}
