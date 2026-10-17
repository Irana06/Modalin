<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\AuditLog;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->role, fn ($q, $role) => $q->where('role', $role))
            ->when($request->search, fn ($q, $search) => $q->where(fn ($q) => $q
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")))
            ->orderBy('name')
            ->paginate($request->integer('per_page', 10));

        return ApiResponse::success($users);
    }

    public function store(UserRequest $request)
    {
        $user = User::create($request->validated());
        AuditLog::record('user.created', $user, null, $user->only('name', 'email', 'role'));

        return ApiResponse::success($user, 'Akun petugas dibuat.', 201);
    }

    public function update(UserRequest $request, User $user)
    {
        $user->fill(array_filter($request->validated()));
        $changed = array_values(array_intersect(array_keys($user->getDirty()), ['name', 'email', 'role']));
        $old = array_intersect_key($user->getOriginal(), array_flip($changed));
        $user->save();
        AuditLog::record('user.updated', $user, $old, $user->only($changed));

        return ApiResponse::success($user, 'Akun diperbarui.');
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->is($request->user())) {
            return ApiResponse::error('Anda tidak bisa menghapus akun sendiri.', 422);
        }

        $user->delete();
        $user->tokens()->delete();
        AuditLog::record('user.deleted', $user, $user->only('name', 'email', 'role'));

        return ApiResponse::success(null, 'Akun dihapus.');
    }
}
