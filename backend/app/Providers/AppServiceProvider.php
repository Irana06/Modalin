<?php

namespace App\Providers;

use App\Enums\Role;
use App\Models\AuditLog;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Gate::define('admin', fn (User $user) => $user->role === Role::Admin);

        RateLimiter::for('login', fn (Request $request) => Limit::perMinute(5)
            ->by(strtolower((string) $request->input('email')).'|'.$request->ip())
            ->response(function (Request $request, array $headers) {
                AuditLog::record('auth.throttled', null, null, ['email' => $request->input('email')]);

                return ApiResponse::error("Terlalu banyak percobaan masuk. Coba lagi dalam {$headers['Retry-After']} detik.", 429)
                    ->withHeaders($headers);
            }));

        RateLimiter::for('register', fn (Request $request) => Limit::perMinute(5)->by($request->ip()));
        RateLimiter::for('submit-loan', fn (Request $request) => Limit::perMinute(5)->by($request->user()->id));
    }
}
