<?php

namespace App\Http\Controllers\Admin;

use App\Models\Database\UserRoles;
use App\Models\Permissions;
use App\Models\Roles;
use App\Models\RolesPermissions;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AdminUserRolesController extends Controller {

    public function __construct() {

    }

    public function index() {
        return view('admin.user_roles.index', [
            'title' => 'Kullanıcı Rolleri',
            'user_roles' => Roles::get()
        ]);
    }

    public function addProcess(Request $request){
        if( $request->slug && $request->name && $request->description){
            $insert_data=[
                'slug'=>$request->slug,
                'name'=>$request->name,
                'description'=>$request->description,
            ];
            Roles::create($insert_data);
            return response()->json([
                'status' => 1,
                'msg' => 'Rol başarılı şekilde eklenmiştir.'
            ]);
        }else{
            return response()->json([
                'status' => 0,
                'msg' => 'Bilinmeyen bir hata oluştu'
            ]);
        }
    }

    public function del(Request $request){
        $user = $request->user();
        if ($user->can('can-delete-role')) {
            $role_id = $request->role_id;
            if( $role_id == 1 || $role_id == 2  ){
                return response()->json([
                    'status' => 0,
                    'msg' => 'Varsayılan kullanıcı rollerini silemezsiniz.'
                ]);
            }else{
                UserRoles::where('role_id', $request->role_id)->update([
                    'role_id' => 2
                ]);
                $role = Roles::find($request->role_id);
                $role->delete();
                return response()->json([
                    'status' => 1,
                    'msg' => 'Belirtilen rol başarılı şekilde güncellendi.'
                ]);
            }
        }else{
            return response()->json([
                'status' => 0,
                'msg' => 'Bu işlem için yeterli yetkiniz bulunmamaktadır.'
            ]);
        }
    }

    public function RolesPermissions($id, Request $request) {
        $per_data = array();
        $permissions = Permissions::where('slug', '!=', 'can-role')
                         ->where('slug', '!=', 'can-role-add')
                        ->where('slug', '!=', 'can-edit-role')
                        ->where('slug', '!=', 'change-role-permission')->get();
        $i = -1;
        foreach ($permissions as $p) {
            $i++;
            $check_role_permission = RolesPermissions::where('role_id', $id)->where('permission_id', $p->id)->count();
            $per_data[$i]['id'] = $p->id;
            $per_data[$i]['slug'] = $p->slug;
            $per_data[$i]['name'] = $p->name;
            $per_data[$i]['status'] = ( $check_role_permission > 0 ? true : false);
        }

        return view('admin.user_roles.roles_permissions', [
            'title' => 'Role Yetkilerini Düzenle',
            'role' => Roles::where('id', $id)->first(),
            'permissions' => $per_data
        ]);
    }

    public function givePermissionToRole(Request $request) {
        $user = $request->user();
        if ($user->can('change-role-permission')) {
            $role_id = $request->input('role_id');
            $permission_id = $request->input('permission_id');
            $givePermissiontoRole = RolesPermissions::create([
                        'role_id' => $role_id,
                        'permission_id' => $permission_id
            ]);
            if ($givePermissiontoRole == TRUE) {
                return response()->json([
                            'status' => 1,
                            'msg' => 'Belirtilen role yetki başarılı bir şekilde atanmıştır.'
                ]);
            } else {
                return response()->json([
                            'status' => 0,
                            'msg' => 'İşlem yapılırken bir hata meydana geldi.'
                ]);
            }
        } else {
            return response()->json([
                        'status' => 0,
                        'msg' => 'Role yetkilerini düzenlemek için yeterli yetkiniz bulunmamaktadır.'
            ]);
        }
    }

    public function takePermissionFromRole(Request $request) {
        $user = $request->user();
        if ($user->can('change-role-permission')) {
            $role_id = $request->input('role_id');
            $permission_id = $request->input('permission_id');
            $takePermissionFromRole = RolesPermissions::where('role_id', '=', $role_id)
                            ->where('permission_id', '=', $permission_id)->delete();
            if ($takePermissionFromRole == TRUE) {
                return response()->json([
                            'status' => 1,
                            'msg' => 'Belirtilen role yetki başarılı bir şekilde geri alınmıştır.'
                ]);
            } else {
                return response()->json([
                            'status' => 0,
                            'msg' => 'İşlem yapılırken bir hata meydana geldi.'
                ]);
            }
        } else {
            return response()->json([
                        'status' => 0,
                        'msg' => 'Role yetkilerini düzenlemek için yeterli yetkiniz bulunmamaktadır.'
            ]);
        }
    }

    public function multipleGivePermission(Request $request){
        $user = $request->user();
        if($user->can('change-role-permission')) {
            $role_id = $request->role_id;
            $permissions = $request->permissions;
            foreach( $permissions as $permission ){
                RolesPermissions::create([
                    'role_id' => $role_id,
                    'permission_id' => $permission
                ]);
            }
            return response()->json([
                'status' => 1,
                'msg' => 'Belirtilen rol yetkileri başarılı bir şekilde geri eklenmiştir.'
            ]);
        }else{
            return response()->json([
                'status' => 0,
                'msg' => 'Role yetkilerini düzenlemek için yeterli yetkiniz bulunmamaktadır.'
            ]);
        }
    }

    public function multipleTakePermission(Request $request){
        $user = $request->user();
        if($user->can('change-role-permission')) {
            $role_id = $request->role_id;
            $permissions = $request->permissions;
            foreach( $permissions as $permission ){
                RolesPermissions::where('role_id', '=', $role_id)->where('permission_id', '=', $permission)->delete();
            }
            return response()->json([
                'status' => 1,
                'msg' => 'Belirtilen rol yetkileri başarılı bir şekilde geri kaldırılmıştır.'
            ]);
        }else{
            return response()->json([
                'status' => 0,
                'msg' => 'Role yetkilerini düzenlemek için yeterli yetkiniz bulunmamaktadır.'
            ]);
        }
    }

}
