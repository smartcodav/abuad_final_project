<?php

namespace App\Http\Controllers\Api\Invigilator;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Invigilator\AttendanceCheckRequest;
use App\Http\Requests\Api\Invigilator\AttendanceStoreRequest;
use App\Models\AcademicSession;
use App\Models\Attendance;
use App\Models\Student;
use App\Services\FaceMatchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class AttendanceController extends Controller
{
    public function __construct(private readonly FaceMatchService $faceMatchService) {}

    public function check(AttendanceCheckRequest $request): JsonResponse
    {
        $student = Student::findOrFail($request->validated('student_id'));

        abort_unless($student->hasCompletedOnboarding() && $student->face_descriptor, 422, 'Student has not completed onboarding face capture.');

        $result = $this->faceMatchService->compare($student, $request->file('photo'));

        if (! $result['success']) {
            return response()->json(['message' => $result['message']], 422);
        }

        return response()->json([
            'distance' => $result['distance'],
            'match_score' => $result['match_score'],
            'is_match' => $result['is_match'],
        ]);
    }

    public function store(AttendanceStoreRequest $request): JsonResponse
    {
        $student = Student::findOrFail($request->validated('student_id'));
        $session = AcademicSession::where('is_active', true)->firstOrFail();
        $semester = $session->activeSemester();

        abort_if(! $semester, 500, 'No active semester is configured.');

        $photoPath = $request->hasFile('photo')
            ? $request->file('photo')->store('attendances', 'public')
            : null;

        $attendance = Attendance::create([
            'student_id' => $student->id,
            'course_id' => $request->validated('course_id'),
            'invigilator_id' => $request->user()->id,
            'academic_session_id' => $session->id,
            'semester_id' => $semester->id,
            'match_score' => $request->validated('match_score'),
            'status' => $request->validated('status'),
            'captured_photo_path' => $photoPath,
            'marked_at' => now(),
        ]);

        return response()->json([
            'attendance' => [
                'id' => $attendance->id,
                'status' => $attendance->status,
                'match_score' => $attendance->match_score,
                'marked_at' => $attendance->marked_at,
                'photo_url' => $photoPath ? Storage::url($photoPath) : null,
            ],
        ], 201);
    }
}
