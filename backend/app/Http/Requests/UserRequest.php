<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

/** Staff accounts only. UMKM accounts are created through registration. */
class UserRequest extends FormRequest
{
    public function rules(): array
    {
        $user = $this->route('user');

        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:100', Rule::unique('users')->ignore($user)],
            'role' => ['required', 'in:admin,verifikator,manajer'],
            'password' => [$user ? 'nullable' : 'required', Password::min(8)->letters()->numbers()],
        ];
    }
}
