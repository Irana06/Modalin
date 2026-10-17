<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Installment;
use App\Support\ApiResponse;

class InstallmentController extends Controller
{
    public function pay(Installment $installment)
    {
        if ($installment->paid_at) {
            return ApiResponse::error('Cicilan ini sudah tercatat lunas.', 422);
        }
        $earliestUnpaid = $installment->loanApplication->installments()->whereNull('paid_at')->value('number');
        if ($installment->number !== $earliestUnpaid) {
            return ApiResponse::error("Lunasi cicilan ke-{$earliestUnpaid} terlebih dahulu.", 422);
        }

        $installment->update(['paid_at' => now()]);
        AuditLog::record('installment.paid', $installment->loanApplication, null, ['installment' => $installment->number]);

        return ApiResponse::success($installment, "Cicilan ke-{$installment->number} tercatat lunas.");
    }
}
