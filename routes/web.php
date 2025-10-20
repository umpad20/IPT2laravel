<?php

use Illuminate\Support\Facades\Route;

// This will serve the React app for all routes except API
Route::get('/{any}', function () {
    return view('app'); // This should be a Blade file with @vite('resources/js/app.js')
})->where('any', '.*');
