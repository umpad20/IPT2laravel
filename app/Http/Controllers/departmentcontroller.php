<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        return response()->json(Department::with('courses')->get());
    }

    public function store(Request $request)
    {
        $dept = Department::create($request->all());
        return response()->json($dept);
    }

    public function show($id)
    {
        $dept = Department::with('courses')->findOrFail($id);
        return response()->json($dept);
    }

    public function update(Request $request, $id)
    {
        $dept = Department::findOrFail($id);
        $dept->update($request->all());
        return response()->json($dept);
    }

    public function destroy($id)
    {
        $dept = Department::findOrFail($id);
        $dept->courses()->delete(); // delete courses first
        $dept->delete();
        return response()->json(['message' => 'Department deleted']);
    }
}
