<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Faculty;

class FacultyController extends Controller
{
    public function index()
    {
        return response()->json(Faculty::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'department' => 'required|string',
            'course' => 'required|string',
        ]);

        $faculty = Faculty::create($request->only('name','department','course'));
        return response()->json($faculty, 201);
    }

    public function update(Request $request, $id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->update($request->only('name','department','course'));
        return response()->json($faculty);
    }

    public function destroy($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
