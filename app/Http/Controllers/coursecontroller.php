<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    // List courses (optionally filtered by department)
    public function index(Request $request)
    {
        $department_id = $request->query('department_id');
        $query = Course::select('id', 'name', 'department_id');
        if ($department_id) {
            $query->where('department_id', $department_id);
        }
        $courses = $query->get();
        return response()->json(['data' => $courses]);
    }

    // Create
    public function store(Request $request)
    {
        $course = Course::create($request->all());
        return response()->json($course);
    }

    // Read a course
    public function show($id)
    {
        $course = Course::findOrFail($id);
        return response()->json($course);
    }

    // Update
    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $course->update($request->all());
        return response()->json($course);
    }

    // Delete
    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();
        return response()->json(['message' => 'Course deleted']);
    }
}
