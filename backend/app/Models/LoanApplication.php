<?php

namespace App\Models;

use App\Enums\LoanStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class LoanApplication extends Model
{
    use HasUuids, SoftDeletes;

    /** Plafon = omzet bulanan x 3 (kisi-kisi LKS 2026). */
    public const MAX_REVENUE_MULTIPLIER = 3;

    protected $fillable = ['loan_product_id', 'amount', 'tenor_months', 'interest_rate', 'monthly_revenue', 'purpose', 'status'];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'monthly_revenue' => 'integer',
            'interest_rate' => 'float',
            'status' => LoanStatus::class,
            'disbursed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        // shortcut: two submissions in the same instant could get the same code; the unique index rejects the second.
        static::creating(function (self $loan) {
            $count = static::withTrashed()->whereYear('created_at', now()->year)->count() + 1;
            $loan->code = sprintf('MDL-%d-%04d', now()->year, $count);
        });
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class)->withTrashed();
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(LoanProduct::class, 'loan_product_id')->withTrashed();
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ApplicationReview::class)->oldest('created_at');
    }

    public function installments(): HasMany
    {
        return $this->hasMany(Installment::class)->orderBy('number');
    }

    /** Moves the application one stage forward (or to rejected) and records who decided. */
    public function decide(User $reviewer, bool $approve, ?string $note = null): void
    {
        DB::transaction(function () use ($reviewer, $approve, $note) {
            $from = $this->status;
            $this->status = $approve ? $from->next() : LoanStatus::Rejected;

            if ($this->status === LoanStatus::Disbursed) {
                $this->disbursed_at = now();
                $this->installments()->createMany(
                    Installment::schedule($this->amount, $this->interest_rate, $this->tenor_months, now())
                );
            }

            $this->save();
            $this->reviews()->create([
                'reviewer_id' => $reviewer->id,
                'stage' => $from->stage(),
                'decision' => $approve ? 'approved' : 'rejected',
                'note' => $note,
            ]);
            AuditLog::record("loan.{$this->status->value}", $this, ['status' => $from->value], ['status' => $this->status->value]);
        });
    }
}
