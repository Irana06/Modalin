<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Business extends Model
{
    use HasUuids, SoftDeletes;

    public const SECTORS = ['Kuliner', 'Kerajinan', 'Fesyen', 'Jasa', 'Perdagangan', 'Pertanian'];

    protected $fillable = ['name', 'nib', 'sector', 'address', 'monthly_revenue', 'established_year'];

    protected function casts(): array
    {
        return ['monthly_revenue' => 'integer', 'established_year' => 'integer'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function loanApplications(): HasMany
    {
        return $this->hasMany(LoanApplication::class);
    }
}
