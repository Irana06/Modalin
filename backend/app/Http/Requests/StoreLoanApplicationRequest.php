<?php

namespace App\Http\Requests;

use App\Enums\LoanStatus;
use App\Models\LoanApplication;
use App\Models\LoanProduct;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreLoanApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', LoanApplication::class);
    }

    public function rules(): array
    {
        return [
            'loan_product_id' => ['required', Rule::exists('loan_products', 'id')->where('is_active', true)->whereNull('deleted_at')],
            'amount' => ['required', 'integer', 'min:1'],
            'tenor_months' => ['required', 'integer', 'min:1'],
            'purpose' => ['required', 'string', 'min:20', 'max:1000'],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $product = LoanProduct::find($this->loan_product_id);
            $business = $this->user()->business;
            $ceiling = $business->monthly_revenue * LoanApplication::MAX_REVENUE_MULTIPLIER;
            $rupiah = fn (int $n) => 'Rp'.number_format($n, 0, ',', '.');

            if ($this->amount < $product->min_amount || $this->amount > $product->max_amount) {
                $validator->errors()->add('amount', "Jumlah untuk {$product->name} harus {$rupiah($product->min_amount)} s.d. {$rupiah($product->max_amount)}.");
            }
            if ($this->amount > $ceiling) {
                $validator->errors()->add('amount', "Jumlah melebihi plafon {$rupiah($ceiling)} (3 x omzet bulanan).");
            }
            if ($this->tenor_months < $product->min_tenor || $this->tenor_months > $product->max_tenor) {
                $validator->errors()->add('tenor_months', "Tenor untuk {$product->name} harus {$product->min_tenor} s.d. {$product->max_tenor} bulan.");
            }
            if ($business->loanApplications()->whereIn('status', LoanStatus::ACTIVE)->exists()) {
                $validator->errors()->add('loan_product_id', 'Masih ada pengajuan yang berjalan. Tunggu sampai dana cair atau pengajuan ditolak.');
            }
        }];
    }
}
