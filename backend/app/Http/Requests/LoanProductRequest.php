<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoanProductRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'interest_rate' => ['required', 'numeric', 'min:0', 'max:50'],
            'min_amount' => ['required', 'integer', 'min:1000000'],
            'max_amount' => ['required', 'integer', 'gte:min_amount'],
            'min_tenor' => ['required', 'integer', 'min:1', 'max:120'],
            'max_tenor' => ['required', 'integer', 'gte:min_tenor', 'max:120'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
