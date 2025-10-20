<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    // One department has many students
    public function students()
    {
        return $this->hasMany(Student::class);
    }

    // One department has many faculty
    public function faculty()
    {
        return $this->hasMany(Faculty::class);
    }

    // One department has many courses
    public function courses()
    {
        return $this->hasMany(Course::class);
    }
}
