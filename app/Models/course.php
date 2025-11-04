<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $table = 'course'; // no 's'
    protected $fillable = [
        'department_id', 'code', 'name', 'description', 'year_level'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }
}
