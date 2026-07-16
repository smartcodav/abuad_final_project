<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $department = Department::where('name', 'Computer Science')->first();

        if (! $department) {
            return;
        }

        $courses = [
            ['code' => 'CSC101', 'title' => 'Introduction to Computer Science', 'level' => 100, 'unit' => 3],
            ['code' => 'CSC102', 'title' => 'Introduction to Programming', 'level' => 100, 'unit' => 3],
            ['code' => 'CSC201', 'title' => 'Data Structures', 'level' => 200, 'unit' => 3],
            ['code' => 'CSC202', 'title' => 'Computer Organization', 'level' => 200, 'unit' => 3],
        ];

        foreach ($courses as $course) {
            $department->courses()->firstOrCreate(
                ['code' => $course['code']],
                ['title' => $course['title'], 'level' => $course['level'], 'unit' => $course['unit']]
            );
        }
    }
}
