<?php

namespace Database\Seeders;

use App\Models\School;
use Illuminate\Database\Seeder;

class SchoolDepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $school = School::firstOrCreate(
            ['name' => 'College of Computing and Communication Studies'],
            ['code' => 'CCCS']
        );

        $school->departments()->firstOrCreate(
            ['name' => 'Computer Science'],
            ['code' => 'CSC']
        );
    }
}
