<?php

namespace App\Http\Controllers\Api;

use App\Enums\LoanStatus;
use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\DecisionRequest;
use App\Http\Requests\StoreLoanApplicationRequest;
use App\Models\AuditLog;
use App\Models\Installment;
use App\Models\LoanApplication;
use App\Models\LoanProduct;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class LoanApplicationController extends Controller
{
    public function index(Request $request)
    {
        $scoped = LoanApplication::query()
            ->when($request->user()->role === Role::Umkm, fn ($q) => $q->whereRelation('business', 'user_id', $request->user()->id))
            ->when($request->loan_product_id, fn ($q, $id) => $q->where('loan_product_id', $id))
            ->when($request->search, fn ($q, $search) => $q->where(fn ($q) => $q
                ->where('code', 'like', "%{$search}%")
                ->orWhereRelation('business', 'name', 'like', "%{$search}%")));

        $counts = (clone $scoped)->toBase()->selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status');
        $page = $scoped->with('business:id,name,sector', 'product:id,name')
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return ApiResponse::success([...$page->toArray(), 'counts' => $counts]);
    }

    public function store(StoreLoanApplicationRequest $request)
    {
        $business = $request->user()->business;
        $loan = $business->loanApplications()->create([
            ...$request->validated(),
            'interest_rate' => LoanProduct::find($request->loan_product_id)->interest_rate,
            'monthly_revenue' => $business->monthly_revenue,
            'status' => LoanStatus::Submitted,
        ]);
        AuditLog::record('loan.submitted', $loan, null, $loan->only('status', 'amount', 'tenor_months'));

        return ApiResponse::success($loan, 'Pengajuan terkirim dan menunggu verifikasi.', 201);
    }

    public function show(LoanApplication $loanApplication)
    {
        Gate::authorize('view', $loanApplication);
        $loan = $loanApplication->load('business.user:id,name', 'product', 'reviews.reviewer:id,name,role', 'installments');

        // Before disbursement there are no installments yet, so show the schedule the borrower would get.
        $loan->setAttribute('schedule_preview', $loan->installments->isEmpty()
            ? Installment::schedule($loan->amount, $loan->interest_rate, $loan->tenor_months, now())
            : null);

        return ApiResponse::success($loan);
    }

    public function decide(DecisionRequest $request, LoanApplication $loanApplication)
    {
        $approve = $request->decision === 'approved';
        $loanApplication->decide($request->user(), $approve, $request->note);

        return ApiResponse::success(
            $loanApplication->only('id', 'code', 'status'),
            $approve ? 'Keputusan tersimpan, pengajuan diteruskan ke tahap berikutnya.' : 'Pengajuan ditolak.'
        );
    }
}
