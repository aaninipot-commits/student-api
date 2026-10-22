<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    // GET /api/students
    public function index()
    {
        return response()->json(Student::all());
    }

    // POST /api/students
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'course' => 'required|string|max:255',
            'year_level' => 'required|integer|min:1|max:5',
        ]);

        $student = Student::create($validated);

        return response()->json($student, 201);
    }

    // GET /api/students/{student}
    public function show(Student $student)
    {
        return response()->json($student);
    }

    // PUT /api/students/{student}
    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email,' . $student->id,
            'course' => 'required|string|max:255',
            'year_level' => 'required|integer|min:1|max:5',
        ]);

        $student->update($validated);

        return response()->json($student);
    }

    // DELETE /api/students/{student}
    public function destroy(Student $student)
    {
        $student->delete();

        return response()->json([
            'message' => 'Student deleted successfully.',
        ]);
    }
}