<?php

namespace App\Http\Controllers\Api;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\AuditLog;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = DB::transaction(function () use ($request) {
            $user = User::create($request->only('name', 'email', 'password') + ['role' => Role::Umkm]);
            $user->business()->create([
                'name' => $request->business_name,
                ...$request->only('nib', 'sector', 'address', 'monthly_revenue', 'established_year'),
            ]);

            return $user;
        });
        auth()->setUser($user);
        AuditLog::record('auth.registered', $user);

        return ApiResponse::success($this->session($user), 'Akun berhasil dibuat.', 201);
    }

    public function login(Request $request)
    {
        $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string']]);
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return ApiResponse::error('Email atau password salah.', 401);
        }

        auth()->setUser($user);
        AuditLog::record('auth.login', $user);

        return ApiResponse::success($this->session($user), 'Berhasil masuk.');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return ApiResponse::success(null, 'Berhasil keluar.');
    }

    public function me(Request $request)
    {
        return ApiResponse::success($request->user()->load('business'));
    }

    private function session(User $user): array
    {
        return ['user' => $user->load('business'), 'token' => $user->createToken('spa')->plainTextToken];
    }
}
