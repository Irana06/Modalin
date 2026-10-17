<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = AuditLog::with('user:id,name,role')
            ->when($request->action, fn ($q, $action) => $q->where('action', 'like', "{$action}.%"))
            ->latest('created_at')
            ->paginate($request->integer('per_page', 15));

        return ApiResponse::success($logs);
    }
}
