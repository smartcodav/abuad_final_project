<?php

namespace App\Enums;

enum AttendanceStatus: string
{
    case Matched = 'matched';
    case MismatchConfirmed = 'mismatch_confirmed';
    case Absent = 'absent';
}
