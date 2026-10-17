<?php

use App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LoanApplicationController;
use App\Http\Controllers\Api\LoanProductController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register'])->middleware('throttle:register');
Route::post('login', [AuthController::class, 'login'])->middleware('throttle:login');
Route::get('loan-products', [LoanProductController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);

    Route::get('loan-applications', [LoanApplicationController::class, 'index']);
    Route::post('loan-applications', [LoanApplicationController::class, 'store'])->middleware('throttle:submit-loan');
    Route::get('loan-applications/{loanApplication}', [LoanApplicationController::class, 'show']);
    Route::post('loan-applications/{loanApplication}/decision', [LoanApplicationController::class, 'decide']);

    Route::prefix('admin')->middleware('can:admin')->group(function () {
        Route::apiResource('loan-products', Admin\LoanProductController::class)->except('show');
        Route::apiResource('users', Admin\UserController::class)->except('show');
        Route::get('audit-logs', [Admin\AuditLogController::class, 'index']);
        Route::post('installments/{installment}/pay', [Admin\InstallmentController::class, 'pay']);
    });
});
