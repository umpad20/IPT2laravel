<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ReportController;

Route::get('/student-attendance-summary/{student_id}', [ReportController::class,'studentAttendanceSummary']);
Route::get('/student-attendance/{student_id}', [ReportController::class,'studentAttendance']);
Route::get('/faculty-activity-summary/{faculty_id}', [ReportController::class,'facultyActivitySummary']);
Route::get('/faculty-activities/{faculty_id}', [ReportController::class,'facultyActivities']);

Route::post('/change-password', [AuthController::class, 'changePassword']);

// Authentication
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);
// Change password (API)
Route::post('/change-password', [AuthController::class, 'changePassword']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/user/{id}', [AuthController::class, 'getUser']); // simple protected route

Route::get('/faculty', [FacultyController::class,'index']);        // list all
Route::post('/faculty', [FacultyController::class,'store']);       // create
Route::get('/faculty/{id}', [FacultyController::class,'show']);    // single
Route::put('/faculty/{id}', [FacultyController::class,'update']);  // update
Route::delete('/faculty/{id}', [FacultyController::class,'destroy']); // delete

Route::get('/department', [FacultyController::class,'departments']); // dropdown
Route::get('/course', [FacultyController::class,'courses']);        // dropdown

Route::get('/student', [StudentController::class, 'index']);
Route::post('/student', [StudentController::class, 'store']);
Route::get('/student/{id}', [StudentController::class, 'show']);
Route::put('/student/{id}', [StudentController::class, 'update']);
Route::delete('/student/{id}', [StudentController::class, 'destroy']);

Route::get('/department', [DepartmentController::class, 'index']);
Route::get('/course', [CourseController::class, 'index']);

Route::get('/departments', [DepartmentController::class, 'index']);
Route::post('/departments', [DepartmentController::class, 'store']);
Route::get('/departments/{id}', [DepartmentController::class, 'show']);
Route::put('/departments/{id}', [DepartmentController::class, 'update']);
Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);

Route::post('/courses', [CourseController::class, 'store']);
Route::get('/courses/{id}', [CourseController::class, 'show']);
Route::put('/courses/{id}', [CourseController::class, 'update']);
Route::delete('/courses/{id}', [CourseController::class, 'destroy']);


