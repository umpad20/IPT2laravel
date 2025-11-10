<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Department;
use App\Models\Course;
use Carbon\Carbon;

class FacultySeeder extends Seeder
{
    public function run()
    {
        // Truncate existing faculty data (use with caution)
        DB::table('faculty')->truncate();

        $now = Carbon::now()->toDateTimeString();

        // Add one head/person per department and two per course
        $departments = Department::with('courses')->get();

        $inserts = [];

        foreach ($departments as $dept) {
            // Department head
            $inserts[] = [
                'name' => ($dept->head) ? $dept->head : ($dept->name . ' Head'),
                'department' => $dept->code ?? $dept->name,
                'course' => null,
                'department_id' => $dept->id,
                'course_id' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            // For each course under department, add two faculty
            foreach ($dept->courses as $course) {
                $inserts[] = [
                    'name' => 'Prof. ' . $course->code . ' A',
                    'department' => $dept->code ?? $dept->name,
                    'course' => $course->code ?? $course->name,
                    'department_id' => $dept->id,
                    'course_id' => $course->id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                $inserts[] = [
                    'name' => 'Prof. ' . $course->code . ' B',
                    'department' => $dept->code ?? $dept->name,
                    'course' => $course->code ?? $course->name,
                    'department_id' => $dept->id,
                    'course_id' => $course->id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        if (!empty($inserts)) {
            DB::table('faculty')->insert($inserts);
        }
    }
}
