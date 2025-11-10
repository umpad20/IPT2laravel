<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $table = 'student'; // singular as you specified

    protected $fillable = [
        'student_id', 'first_name', 'middle_name', 'last_name', 'suffix',
        'gender', 'birth_date', 'age', 'nationality', 'religion',
        'address', 'city', 'province', 'zip_code', 'email', 'phone',
        'department_id', 'course_id', 'year_level', 'academic_year', 'section', 'enrollment_status',
        'guardian_name', 'guardian_relationship', 'guardian_contact', 'guardian_address'
    ];

    // Relationship to Department
    public function department() {
        return $this->belongsTo(Department::class, 'department_id', 'id');
    }

    // Relationship to Course
    public function course() {
        return $this->belongsTo(Course::class, 'course_id', 'id');
    }
}
