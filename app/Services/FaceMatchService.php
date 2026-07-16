<?php

namespace App\Services;

use App\Models\Student;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;

class FaceMatchService
{
    /**
     * @return array{success: bool, message?: string, distance?: float, match_score?: float, is_match?: bool}
     */
    public function compare(Student $student, UploadedFile $photo): array
    {
        $response = Http::attach('photo', $photo->get(), 'capture.jpg')
            ->post(rtrim(config('services.face_service.url'), '/').'/descriptor');

        if (! $response->successful() || ! $response->json('success')) {
            return [
                'success' => false,
                'message' => $response->json('message', 'No face could be detected in the captured photo.'),
            ];
        }

        $capturedDescriptor = $response->json('descriptor');
        $storedDescriptor = $student->face_descriptor;

        $distance = $this->euclideanDistance($storedDescriptor, $capturedDescriptor);
        $threshold = (float) config('services.face_service.match_distance_threshold');

        return [
            'success' => true,
            'distance' => $distance,
            'match_score' => $this->distanceToScore($distance),
            'is_match' => $distance <= $threshold,
        ];
    }

    private function euclideanDistance(array $a, array $b): float
    {
        $sum = 0.0;

        foreach ($a as $index => $value) {
            $sum += ($value - $b[$index]) ** 2;
        }

        return sqrt($sum);
    }

    private function distanceToScore(float $distance): float
    {
        $normalized = max(0, 1 - min($distance, 1.2) / 1.2);

        return round($normalized * 100, 2);
    }
}
