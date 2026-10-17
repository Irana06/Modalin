<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoanProductRequest;
use App\Models\AuditLog;
use App\Models\LoanProduct;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class LoanProductController extends Controller
{
    public function index(Request $request)
    {
        $products = LoanProduct::query()
            ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->orderBy('min_amount')
            ->paginate(min($request->integer('per_page', 10), 50));

        return ApiResponse::success($products);
    }

    public function store(LoanProductRequest $request)
    {
        $product = LoanProduct::create($request->validated());
        AuditLog::record('product.created', $product, null, $product->toArray());

        return ApiResponse::success($product, 'Produk ditambahkan.', 201);
    }

    public function update(LoanProductRequest $request, LoanProduct $loanProduct)
    {
        $loanProduct->fill($request->validated());
        $old = array_intersect_key($loanProduct->getOriginal(), $loanProduct->getDirty());
        $loanProduct->save();
        AuditLog::record('product.updated', $loanProduct, $old, $loanProduct->getChanges());

        return ApiResponse::success($loanProduct, 'Produk diperbarui.');
    }

    public function destroy(LoanProduct $loanProduct)
    {
        $loanProduct->delete();
        AuditLog::record('product.deleted', $loanProduct, $loanProduct->only('name'));

        return ApiResponse::success(null, 'Produk dihapus.');
    }
}
