<?php

namespace App\Enums;

enum LoanStatus: string
{
    case Submitted = 'submitted';
    case Verified = 'verified';
    case Approved = 'approved';
    case Disbursed = 'disbursed';
    case Rejected = 'rejected';

    /** Statuses that block the business from submitting another application. */
    public const ACTIVE = [self::Submitted, self::Verified, self::Approved];

    public function reviewer(): ?Role
    {
        return match ($this) {
            self::Submitted => Role::Verifikator,
            self::Verified => Role::Manajer,
            self::Approved => Role::Admin,
            default => null,
        };
    }

    public function stage(): string
    {
        return match ($this) {
            self::Submitted => 'verification',
            self::Verified => 'approval',
            self::Approved => 'disbursement',
        };
    }

    public function next(): self
    {
        return match ($this) {
            self::Submitted => self::Verified,
            self::Verified => self::Approved,
            self::Approved => self::Disbursed,
        };
    }
}
