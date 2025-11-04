<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $table = 'department'; // no plural
    protected $fillable = [
        'code',
        'name',
        'description',
        'head',
        'dean_email',
        'dean_contact',
        'office_location'
    ];

    // Relationship: One department has many courses
    public function courses()
    {
        return $this->hasMany(Course::class, 'department_id');
    }
}
