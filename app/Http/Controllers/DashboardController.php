<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Department;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Course;

class DashboardController extends Controller
{
    public function departments() {
        return Department::all();
    }

    public function students() {
        return Student::with('department')->get();
    }

    public function faculty() {
        return Faculty::with('department')->get();
    }

    public function courses() {
        return Course::with('department')->get();
    }

    public function stats() {
        return response()->json([
            'totalStudents' => Student::count(),
            'totalFaculty' => Faculty::count(),
            'totalDepartments' => Department::count(),
            'totalCourses' => Course::count(),
            'studentsPerDepartment' => Department::withCount('students')->get(),
            'facultyPerDepartment' => Department::withCount('faculty')->get(),
        ]);
    }
}
