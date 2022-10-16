<?php

namespace App\Models\Database;

use Illuminate\Database\Eloquent\Model;

class UserRoles extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'users_roles';
    
    protected $fillable = ['user_id', 'role_id'];
}
