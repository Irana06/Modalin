<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoanProduct;
use App\Support\ApiResponse;

class LoanProductController extends Controller
{
    /** Public list for the landing page simulator and the application form. */
    public function index()
    {
        return ApiResponse::success(LoanProduct::where('is_active', true)->orderBy('min_amount')->get());
    }
}
