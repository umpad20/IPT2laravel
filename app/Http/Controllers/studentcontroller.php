<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StudentController extends Controller
{
    // 🔹 List all students
    public function index()
    {
        return response()->json(['data' => Student::orderBy('id', 'desc')->get()]);
    }

    // 🔹 Store new student
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'course' => 'required|string|max:100',
            'department' => 'required|string|max:100',
        ]);

        // Auto-generate Student ID
        $latest = Student::orderBy('id', 'desc')->first();
        $nextNumber = $latest ? (int)Str::after($latest->student_id, '-') + 1 : 1;
        $student_id = '2025-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);

        $data = $request->all();
        $data['student_id'] = $student_id;

        $student = Student::create($data);

        return response()->json([
            'message' => 'Student added successfully',
            'data' => $student
        ], 201);
    }

    // 🔹 Show one student
    public function show($id)
    {
        $student = Student::findOrFail($id);
        return response()->json(['data' => $student]);
    }

    // 🔹 Update student
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $student->update($request->all());

        return response()->json(['message' => 'Student updated successfully', 'data' => $student]);
    }

    // 🔹 Delete student
    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return response()->json(['message' => 'Student deleted successfully']);
    }
}
