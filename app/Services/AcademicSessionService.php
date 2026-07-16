<?php

namespace App\Services;

use App\Models\AcademicSession;
use App\Models\Semester;
use Illuminate\Support\Facades\DB;

class AcademicSessionService
{
    public function activateSession(AcademicSession $session): void
    {
        DB::transaction(function () use ($session) {
            AcademicSession::where('id', '!=', $session->id)->update(['is_active' => false]);
            $session->update(['is_active' => true]);
        });
    }

    public function activateSemester(Semester $semester): void
    {
        DB::transaction(function () use ($semester) {
            Semester::where('id', '!=', $semester->id)->update(['is_active' => false]);
            $semester->update(['is_active' => true]);
            $this->activateSession($semester->academicSession);
        });
    }
}
