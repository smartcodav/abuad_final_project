<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ImportStudentsRequest;
use App\Imports\StudentsImport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Maatwebsite\Excel\Facades\Excel;

class StudentImportController extends Controller
{
    public function create(): InertiaResponse
    {
        return Inertia::render('admin/students/import');
    }

    public function store(ImportStudentsRequest $request): RedirectResponse
    {
        $import = new StudentsImport;

        Excel::import($import, $request->file('file'));

        return to_route('admin.students.index')->with('importResult', [
            'imported' => $import->importedCount,
            'failures' => collect($import->failures())->map(fn ($failure) => [
                'row' => $failure->row(),
                'attribute' => $failure->attribute(),
                'errors' => $failure->errors(),
            ])->all(),
        ]);
    }

    public function template(): HttpResponse
    {
        $headings = ['matric_number', 'full_name', 'department', 'level', 'default_password', 'exam_username', 'exam_password'];
        $example = ['CSC/2021/001', 'Jane Doe', 'Computer Science', '200', '1234567', 'jane.doe', 'examPass123'];

        $csv = implode(',', $headings)."\n".implode(',', $example)."\n";

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="students-import-template.csv"',
        ]);
    }
}
