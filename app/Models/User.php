<?php

namespace App\Models;

use App\Models\Database\UserRoles;
use Auth;
use DB;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable {

    use Notifiable;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'users';
    protected $fillable = [
        'name', 'email', 'password', 'panel_type', 'acente_id'
    ];
    protected $hidden = [
        'password', 'remember_token',
    ];
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public static function getAllUsers($data, $datatable, $sort) {
        $role_id = isset($data['Type']) ? $data['Type'] : "";
        $keyword = isset($data['generalSearch']) ? $data['generalSearch'] : "";
        $sorting = isset($sort) ? $sort : "";

        $query = self::select(
                        "users.*", "users_roles.user_id", "users_roles.role_id", "roles.id as role_table_id", "roles.slug", "roles.name as roles_name", "users_meta.id as meta_id", "users_meta.user_id", "users_meta.first_name", "users_meta.last_name", "users_meta.city", "users_meta.town", "users_meta.phone"
                )
                ->join("users_roles", "users_roles.user_id", "=", "users.id")
                ->join("roles", "roles.id", "=", "users_roles.role_id")
                ->leftJoin("users_meta", "users_meta.user_id", "=", "users.id")
                ->when(isset($data['Status']) && $data['Status'] == 1, function($query) {
                    return $query->where('users.email_verified_at', NULL);
                })
                ->when(isset($data['Status']) && $data['Status'] == 2, function($query) {
                    return $query->where('users.email_verified_at', '!=', NULL);
                })
                ->when($role_id, function($query, $role_id) {
                    return $query->where('roles.id', $role_id);
                })
                ->when($role_id, function($query, $role_id) {
                    return $query->where('roles.id', $role_id);
                })
                ->when($keyword, function($query, $keyword) {
                    return $query->where('users.name', 'like', '%' . $keyword . '%')
                            ->orWhere('users.email', 'like', '%' . $keyword . '%');
                })
                ->when($sorting, function($query) use($sorting) {
                    return $query->orderBy('users.' . $sorting['field'], $sorting['sort']);
                })
                ->where('users_roles.role_id', '!=', 3)
                ->get();
        return $query;
    }

    public function role(){
        return $this->hasOne(UserRoles::class);
    }

    public function user_meta() {
        return $this->hasOne('App\Models\UsersMeta', 'user_id', 'id');
    }

    public function acente() {
        return $this->belongsTo('App\Models\Acente', 'acente_id', 'id');
    }

    public static function getNotifications() {
        $users = collect(self::take(5)->get());
        return $users;
    }

    public static function getUserRole($user_id) {
        $user_role = \DB::table('users_roles')->where('user_id', $user_id)->first();
        return $user_role->role_id;
    }

    public static function getCityName($cid) {
        if ($cid != NULL) {
            $country = \App\Models\City::where('CityID', $cid)->first();
            return $country->CityName;
        } else {
            return "Belirtilmemiş";
        }
    }

    public static function getTownName($cid) {
        if ($cid != NULL) {
            $town = \App\Models\Town::where('TownID', $cid)->first();
            return $town->TownName;
        } else {
            return "Belirtilmemiş";
        }
    }

    public static function getRoleId(){
        $id=Auth()->user()->id;
        $role_id = \DB::table('users_roles')->where('user_id',$id)->first();
        return $role_id;
    }

}
