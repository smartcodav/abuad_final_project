<?php

namespace App\Http\Controllers\Api\Invigilator;

use App\Http\Controllers\Controller;
use App\Models\AcademicSession;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    public function index(): JsonResponse
    {
        [$session, $semester] = $this->activeSessionAndSemester();

        $courses = Course::query()
            ->whereHas('courseRegistrations', function ($query) use ($session, $semester) {
                $query->where('academic_session_id', $session->id)->where('semester_id', $semester->id);
            })
            ->with('department')
            ->orderBy('code')
            ->get()
            ->map(fn (Course $course) => [
                'id' => $course->id,
                'code' => $course->code,
                'title' => $course->title,
                'level' => $course->level,
                'department' => $course->department->name,
            ]);

        return response()->json(['courses' => $courses]);
    }

    public function students(Course $course): JsonResponse
    {
        [$session, $semester] = $this->activeSessionAndSemester();

        $students = $course->courseRegistrations()
            ->where('academic_session_id', $session->id)
            ->where('semester_id', $semester->id)
            ->with('student.user')
            ->get()
            ->pluck('student')
            ->filter(fn ($student) => $student && $student->hasCompletedOnboarding())
            ->map(function ($student) use ($course) {
                $latestAttendance = $student->attendances()
                    ->where('course_id', $course->id)
                    ->latest('marked_at')
                    ->first();

                return [
                    'id' => $student->id,
                    'name' => $student->user->name,
                    'matric_number' => $student->user->matric_number,
                    'photo_url' => $student->passport_photo_path ? Storage::url($student->passport_photo_path) : null,
                    'latest_attendance' => $latestAttendance?->only(['status', 'match_score', 'marked_at']),
                ];
            })
            ->values();

        return response()->json(['students' => $students]);
    }

    /**
     * @return array{0: AcademicSession, 1: \App\Models\Semester}
     */
    private function activeSessionAndSemester(): array
    {
        $session = AcademicSession::where('is_active', true)->firstOrFail();
        $semester = $session->activeSemester();

        abort_if(! $semester, 500, 'No active semester is configured.');

        return [$session, $semester];
    }
}
