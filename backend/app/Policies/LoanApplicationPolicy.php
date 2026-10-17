<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\LoanApplication;
use App\Models\User;

class LoanApplicationPolicy
{
    public function view(User $user, LoanApplication $loan): bool
    {
        return $user->role !== Role::Umkm || $loan->business->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->role === Role::Umkm;
    }

    /** Each status can only be decided by one role: verifikator, then manajer, then admin. */
    public function decide(User $user, LoanApplication $loan): bool
    {
        return $loan->status->reviewer() === $user->role;
    }
}
