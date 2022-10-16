<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsersRoles extends Model {

    protected $table = 'users_roles';
    protected $fillable = [
        'user_id',
        'role_id'
    ];

}
