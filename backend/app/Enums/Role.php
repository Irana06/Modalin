<?php

namespace App\Enums;

enum Role: string
{
    case Admin = 'admin';
    case Umkm = 'umkm';
    case Verifikator = 'verifikator';
    case Manajer = 'manajer';
}
