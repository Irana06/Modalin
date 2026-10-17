<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LoanProduct extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = ['name', 'interest_rate', 'min_amount', 'max_amount', 'min_tenor', 'max_tenor', 'is_active'];

    protected function casts(): array
    {
        return [
            'interest_rate' => 'float',
            'min_amount' => 'integer',
            'max_amount' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
