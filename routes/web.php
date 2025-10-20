<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// This will serve the React app for all routes except API
Route::get('/{any}', function () {
    return view('app'); // This should be a Blade file with @vite('resources/js/app.js')
})->where('any', '.*');

// Redirect root to login page
Route::get('/', function () {
    return view('app'); // React app mounts here
});