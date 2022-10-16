<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsersMeta extends Model {

    protected $table = 'users_meta';
    protected $fillable = [
        'id',
        'user_id',
        'first_name',
        'last_name',
        'city',
        'phone',
        'town',
        'phone_2',
        'unvan'
    ];

}
