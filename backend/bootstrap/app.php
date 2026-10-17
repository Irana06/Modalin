<?php

use App\Support\ApiResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // There is no web login route; without this, guests hitting the API cause a route-not-found error.
        $middleware->redirectGuestsTo('/login');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Throwable $e, Request $request) {
            // HttpResponseException already carries a finished response (e.g. the custom login throttle).
            if (! $request->is('api/*') || $e instanceof HttpResponseException) {
                return null;
            }

            return match (true) {
                $e instanceof ValidationException => ApiResponse::error('Data yang dikirim belum valid.', 422, $e->errors()),
                $e instanceof AuthenticationException => ApiResponse::error('Sesi berakhir. Silakan masuk kembali.', 401),
                $e instanceof AccessDeniedHttpException => ApiResponse::error('Anda tidak punya akses untuk aksi ini.', 403),
                $e instanceof NotFoundHttpException => ApiResponse::error('Data tidak ditemukan.', 404),
                $e instanceof HttpExceptionInterface && $e->getStatusCode() === 429 => ApiResponse::error('Terlalu banyak permintaan. Coba lagi sebentar lagi.', 429),
                $e instanceof HttpExceptionInterface => ApiResponse::error($e->getMessage() ?: 'Permintaan tidak bisa diproses.', $e->getStatusCode()),
                default => ApiResponse::error(config('app.debug') ? $e->getMessage() : 'Terjadi kesalahan pada server.', 500),
            };
        });
    })->create();
