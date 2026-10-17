<?php

namespace App\Http\Requests;

use App\Models\Business;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:100', 'unique:users'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
            'business_name' => ['required', 'string', 'max:100'],
            'nib' => ['required', 'digits:13', 'unique:businesses'],
            'sector' => ['required', Rule::in(Business::SECTORS)],
            'address' => ['required', 'string', 'max:255'],
            'monthly_revenue' => ['required', 'integer', 'min:1000000'],
            'established_year' => ['required', 'integer', 'min:1950', 'max:'.now()->year],
        ];
    }
}
