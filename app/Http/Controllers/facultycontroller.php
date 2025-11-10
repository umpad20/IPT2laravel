<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Department;
use App\Models\Course;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    // List all faculty
    public function index()
    {
        $faculty = Faculty::with(['department', 'course'])->get();
        return response()->json(['data' => $faculty]);
    }

    // Store new faculty
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'department_id' => 'required|exists:department,id',
            'course_id' => 'required|exists:course,id',
            'contact_number' => 'nullable|string',
            'position' => 'nullable|string',
            'office_location' => 'nullable|string',
        ]);

        $faculty = Faculty::create($validated);
        return response()->json(['data' => $faculty]);
    }

    // Show single faculty
    public function show($id)
    {
        $faculty = Faculty::with(['department', 'course'])->findOrFail($id);
        return response()->json(['data' => $faculty]);
    }

    // Update faculty
    public function update(Request $request, $id)
    {
        $faculty = Faculty::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'department_id' => 'required|exists:department,id',
            'course_id' => 'required|exists:course,id',
            'contact_number' => 'nullable|string',
            'position' => 'nullable|string',
            'office_location' => 'nullable|string',
        ]);

        $faculty->update($validated);
        return response()->json(['data' => $faculty]);
    }

    // Delete faculty
    public function destroy($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->delete();
        return response()->json(['message' => 'Faculty deleted']);
    }

    // List departments
    public function departments()
    {
        return response()->json(['data' => Department::all()]);
    }

    // List courses (optionally filtered by department)
    public function courses(Request $request)
    {
        $department_id = $request->query('department_id');
        $query = Course::select('id', 'name');
        if ($department_id) {
            $query->where('department_id', $department_id);
        }
        $courses = $query->get();
        return response()->json(['data' => $courses]);
    }
}
