<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        // Include department and course names
        $students = Student::with(['department', 'course'])->get();
        return response()->json(['data' => $students]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:student,email',
            'department_id' => 'required|exists:department,id',
            'course_id' => 'required|exists:course,id',
            'year_level' => 'required|integer|min:1|max:5'
        ]);

        $student = Student::create($request->all());
        return response()->json($student);
    }

    public function show($id)
    {
        $student = Student::with(['department', 'course'])->findOrFail($id);
        return response()->json($student);
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:student,email,' . $id,
            'department_id' => 'required|exists:department,id',
            'course_id' => 'required|exists:course,id',
            'year_level' => 'required|integer|min:1|max:5'
        ]);

        $student->update($request->all());
        return response()->json($student);
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();
        return response()->json(['message' => 'Student deleted']);
    }
}
