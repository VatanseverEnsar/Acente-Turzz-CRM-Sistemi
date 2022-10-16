<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    protected $table = 'settings';
    protected $primaryKey = 'settings_id';
    protected $fillable = ['settings_id', 'settings_key', 'settings_value'];
}
