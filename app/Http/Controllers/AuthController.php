<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Register new user
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed', // expects password_confirmation field
        ]);

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'name' => null, // name is optional now
        ]);

        return response()->json(['message' => 'Account created successfully'], 201);
    }

    // Login existing user
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Simple token generation for frontend (you can use JWT or Laravel Sanctum later)
        $token = base64_encode($user->id . '|' . now());

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    // Logout (frontend should just delete token)
    public function logout(Request $request)
    {
        return response()->json(['message' => 'Logged out successfully']);
    }
}
