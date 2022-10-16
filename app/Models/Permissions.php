<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permissions extends Model
{
    protected $table = 'permissions';
    protected $primaryKey = 'id';
    
    public function RolesPermissions($id){
        return self::select(
                "permissions.*",
                "roles_permissions.*"
                )
                ->leftJoin("roles_permissions.permissions_id", "roles_permissions.permissions_id", "=", "permissions.id")
                ->where('roles_permissions.role_id', $id)
                ->get();
    }
}
