<?php

namespace App\Http\Controllers\Admin;

use App\Models\Customers;
use App\Models\Acente;
use App\Models\Reminders;
use App\Models\User;
use App\Models\UsersMeta;
use App\Models\Roles;
use App\Models\Database\UserRoles;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Mail;
use Illuminate\Support\Facades\Hash;
use App\Models\BankAccounts;
use Auth;

class AdminUserController extends Controller {

    public function __construct() {

    }

    public function index(Request $request) {
        $users = User::all()->except([1]);
        $json_data = [];
        foreach( $users as $user ){
            $json_data[$user->id] = $user->name;
        }
        $data = [
            'title' => 'Kullanıcı İşlemleri',
            'user_roles' => Roles::all(),
            'json_data' => $json_data
        ];
        return view('admin.users.index', $data);
    }

    public function getAllUsers(Request $request) {
        $query = $request->input('query');
        $datatable = $request->input('datatable');
        $sort = $request->input('sort');
        $users = User::getAllUsers($query, $datatable, $sort);
        $users = $users->except([1]);
        return json_encode($users, TRUE);
    }

    public function add() {
        return view('admin.users.add', [
            'title' => 'Yeni Kullanıcı Ekle',
            'roles' => Roles::where('id', '!=', 3)->get(),
            'acenteler' => Acente::all()
        ]);
    }

    public function addNewUser(Request $request) {
        $user = $request->user();

        if ($user->can('can-add-user')) {
            $createUser =[
                'name' => $request->input('firstname').' '.$request->input('lastname'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
            ];
            User::create($createUser);
            $insert_id = $createUser->id;
            if ($createUser == TRUE) {
                $insert_meta_data = UsersMeta::create([
                            'user_id' => $insert_id,
                            'first_name' => $request->input('firstname'),
                            'last_name' => $request->input('lastname'),
                            'phone' => $request->input('phone')
                ]);
                $insert_role = UserRoles::create([
                            'user_id' => $insert_id,
                            'role_id' => $request->input('account_role')
                ]);
                if ($insert_role == TRUE) {
                    return response()->json([
                                'status' => 1,
                                'msg' => 'Kullanıcı başarılı bir şekilde eklendi. Kullanıcılar listesine giderek lütfen oluşturlan hesabı onaylayınız.'
                    ]);
                }
            }
        } else {
            return response()->json([
                        'status' => 0,
                        'msg' => 'Kullanıcı ekleme yetkiniz bulunmamaktadır'
            ]);
        }
    }

    public function edit($id, Request $request) {
        $user = User::find($id);
        if ($user) {
            $user_meta = User::find($id)->user_meta;
            $user_billing = unserialize($user_meta['billing_address']);
            $data = [
                'title' => 'Kullanıcı Düzenle | Marka Temsilci Satış Portalı',
                'user' => $user,
                'user_meta' => $user_meta
            ];
            return view('admin.users.edit', $data);
        } else {
            abort(404);
        }
    }

    public function editUserInfo(Request $request) {
        $user_id = $request->input('user_id');
        $check_user = User::where('id', $user_id)->count();
        if ($check_user > 0) {
            $validator = Validator::make($request->all(), [
                        'name' => 'required|max:500',
                        'first_name' => 'required|max:500',
                        'last_name' => 'required|max:500',
                        'phone' => 'required'
            ]);

            if ($validator->fails()) {
                return redirect()
                                ->route('admin_user_edit', ['id' => $user_id])
                                ->withErrors($validator)
                                ->withInput();
            }
            $updateUser = User::where('id', $user_id)->update([
                'name' => $request->input('first_name').' '.$request->input('last_name'),
            ]);
            if ($updateUser == TRUE) {
                $update_meta_data = [
                    'first_name' => $request->input('first_name'),
                    'last_name' => $request->input('last_name'),
                    'city' => $request->input('city'),
                    'phone' => $request->input('phone'),
                    'town' => $request->input('town'),
                    'unvan' => $request->input('unvan'),
                    'phone_2' => $request->input('phone_2')
                ];
                UsersMeta::where('user_id', $user_id)->update($update_meta_data);
                UserRoles::where('user_id', $user_id)->update([
                    'role_id' => $request->input('account_role')
                ]);
                return redirect()->route('admin_user_edit', ['id' => $user_id])->with([
                            'status' => 1,
                            'msg' => 'Profil başarılı bir şekilde güncellendi'
                ]);
            } else {
                return redirect()->route('admin_user_edit', ['id' => $user_id])->with([
                            'status' => 0,
                            'msg' => 'Profil güncellenirken bir hata meydana geldi'
                ]);
            }
        } else {
            abort(404);
        }
    }

    public function uploadUserImageByAjax(Request $request) {

        $request->validate([
            'user_image' => ['mimes:jpeg,jpg,png,gif|required|max:10000'],
        ]);
        $image = $request->file('user_image');
        $image_name = rand() . '.' . $image->getClientOriginalExtension();
        $update_image = $image->move(public_path('images/avatars'), $image_name);
        if ($update_image) {
            $user_id = $request->input('user_id');
            UsersMeta::where('user_id', $user_id)->update([
                'profile_img' => $image_name
            ]);
            return response()->json([
                        'msg' => 'Profil resmi başarılı şekilde güncellendi',
                        'status' => 1,
                        'image_name' => $image_name
            ]);
        }
    }

    public function getUserExistingProfileImage(Request $request) {
        $user_id = $request->input('user_id');
        $user = UsersMeta::where('user_id', $user_id)->first();
        $user_image = $user->profile_img;
        if ($user_image != NULL) {
            return response()->json([
                        'status' => 1,
                        'name' => $user_image,
                        'size' => File::size(public_path('images/avatars/' . $user_image)),
                        'path' => url('images/avatars/' . $user_image)
            ]);
        } else {
            return response()->json([
                        'status' => 0,
                        'msg' => 'Kullanıcının zaten bir profile resmi mevcut değildir.'
            ]);
        }
    }

    public function removeUserProfileImage(Request $request) {
        $user_id = $request->input('user_id');
        $fileName = $request->input('fileName');
        if ($user_id != "" && $fileName != "") {
            $user_meta = UsersMeta::where('user_id', $user_id)->first();
            if ($fileName == $user_meta->profile_img) {
                $delFile = UsersMeta::where('user_id', $user_id)->update([
                    'profile_img' => NULL
                ]);
                if ($delFile == TRUE) {
                    unlink(public_path('images/avatars/' . $user_meta->profile_img));
                    return response()->json([
                                'status' => 1,
                                'msg' => 'Profil resmi başarılı bir şekilde silindi'
                    ]);
                } else {
                    return response()->json([
                                'status' => 0,
                                'msg' => 'Profil resmi silinirken bir hata meydana geldi'
                    ]);
                }
            } else {
                return response()->json([
                            'status' => 0,
                            'msg' => 'Profil resmi zaten bulunmuyor.'
                ]);
            }
        } else {
            return response()->json([
                        'status' => 0,
                        'msg' => 'Profil resmi zaten bulunmuyor.'
            ]);
        }
    }

    public function userApply(Request $request) {
        $user = $request->user();
        if ($user->can('can-apply-user')) {
            $user_id = $request->input('user_id');
            $user_count = User::where('id', $user_id)->get()->count();
            $get_user = User::where('id', $user_id)->first();
            if ($user_count > 0) {
                if ($get_user->email_verified_at == NULL) {
                    $update_data = [
                        'email_verified_at' => date('Y-m-d H:i:s')
                    ];
                    $apply_user = User::where('id', $user_id)->update($update_data);
                    if ($apply_user == TRUE) {
                        $result = [
                            'status' => 1,
                            'msg' => 'Kullanıcı başarılı bir şekilde aktif edildi.'
                        ];
                        echo json_encode($result);
                    } else {
                        $result = [
                            'status' => 0,
                            'msg' => 'Kullanıcı aktif edilirken bir hata meydana geldi.'
                        ];
                        echo json_encode($result);
                    }
                } else {
                    $result = [
                        'status' => 0,
                        'msg' => 'Bu kullanıcı zaten aktif olarak görünmektedir.'
                    ];
                    echo json_encode($result);
                }
            } else {
                $result = [
                    'status' => 0,
                    'msg' => 'Sistemde kayıtlı böyle bir kullanıcı bulunamadı.'
                ];
                echo json_encode($result);
            }
        } else {
            $result = [
                'status' => 0,
                'msg' => 'Bu işlemi gerçekleştirmek için yeterli yetkiniz bulunmamaktadır.'
            ];
            echo json_encode($result);
        }
    }

    public function checkUserEmail(Request $request) {
        $email = $request->input('email');
        $count_email = User::where('email', $email)->count();
        if ($count_email > 0) {
            echo json_encode(array(
                'valid' => false,
            ));
        } else {
            echo json_encode(array(
                'valid' => true,
            ));
        }
    }

    public function changeUserPassword($id, Request $request) {
        $user = User::find($id);
        if ($user) {
            $user_meta = User::find($id)->user_meta;
            $data = [
                'title' => 'Kullanıcı Şifre Güncelle | Marka Temsilci Satış Portalı',
                'user' => $user,
                'user_meta' => $user_meta
            ];
            return view('admin.users.change_password', $data);
        } else {
            abort(404);
        }
    }

    public function changePasswordProcess(Request $request) {
        $user_id = $request->input('user_id');
        $count_user = User::where('id', $user_id)->count();
        if ($count_user > 0) {
            $validator = Validator::make($request->all(), [
                        'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            if ($validator->fails()) {
                return redirect()
                                ->route('change_user_password', ['id' => $user_id])
                                ->withErrors($validator)
                                ->withInput();
            }
            $password = $request->input('password');
            $update_data = [
                'password' => Hash::make($password)
            ];
            User::where('id', $user_id)->update($update_data);
            return redirect()->route('change_user_password', ['id' => $user_id])->with([
                        'status' => 1,
                        'msg' => 'Şifre başarılı bir şekilde güncellendi'
            ]);
        } else {
            abort(404);
        }
    }

    public function del(Request $request) {
        $user = $request->user();
        if ($request->input('user_id')) {
            if ($user->can('can-delete-user')) {
                $user_id = $request->input('user_id');
                $check_user = User::where('id', $user_id)->count();
                if ($check_user > 0) {
                    $user = User::find($user_id);
                    $update_user_id = $request->input('update_user_id');
                    $this->transformUserContracts($user_id, $update_user_id);
                    $this->transformUserCustomers($user_id, $update_user_id);
                    $this->transformUserAppointments($user_id, $update_user_id);
                    $this->transformUserBids($user_id, $update_user_id);
                    $this->transformUserCalls($user_id, $update_user_id);
                    $this->transformUserReminders($user_id, $update_user_id);
                    $user->delete();
                    return response()->json([
                        'status' => 1,
                        'msg' => 'Kullanıcı başarılı bir şekilde silindi'
                    ]);
                } else {
                    return response()->json([
                                'status' => 0,
                                'msg' => 'Herhangi bir kullanıcı bulunamadı.'
                    ]);
                }
            } else {
                return response()->json([
                            'status' => 0,
                            'msg' => 'Bu işlemi gerçekleştirmek için yeterli yetkiniz bulunmamaktadır.'
                ]);
            }
        } else {
            return response()->json([
                        'status' => 0,
                        'msg' => 'Teknik bir hata meydana geldi.'
            ]);
        }
    }

    public function transformUserCustomers($user_id, $update_user_id){
        Customers::where('user_id', $user_id)->update([
            'user_id' => $update_user_id
        ]);
        Customers::where('update_user_id', $user_id)->update([
            'update_user_id' => $update_user_id
        ]);
        Customers::where('parent_user_id', $user_id)->update([
            'parent_user_id' => $update_user_id
        ]);
    }

    public function transformUserAppointments($user_id, $update_user_id){
        Appointments::where('user_id', $user_id)->update([
            'user_id' => $update_user_id
        ]);
        Appointments::where('update_user_id', $user_id)->update([
            'update_user_id' => $update_user_id
        ]);
    }

    public function transformUserBids($user_id, $update_user_id){
        Bids::where('user_id', $user_id)->update([
            'user_id' => $update_user_id
        ]);
        Bids::where('update_user_id', $user_id)->update([
            'update_user_id' => $update_user_id
        ]);
    }

    public function transformUserCalls($user_id, $update_user_id){
        Call::where('user_id', $user_id)->update([
            'user_id' => $update_user_id
        ]);
        Call::where('update_user_id', $user_id)->update([
            'update_user_id' => $update_user_id
        ]);
    }

    public function transformUserContracts($user_id, $update_user_id){
        Contract::where('user_id', $user_id)->update([
            'user_id' => $update_user_id
        ]);
    }

    public function transformUserReminders($user_id, $update_user_id){
        Reminders::where('user_id', $user_id)->update([
            'user_id' => $update_user_id
        ]);
        Reminders::where('user_id', $user_id)->update([
            'update_user_id' => $update_user_id
        ]);
    }

    public function delUsers(Request $request) {
        $user = $request->user();
        if ($request->input('ids')) {
            if ($user->can('can-delete-user')) {
                $selected_ids = $request->input('ids');
                foreach ($selected_ids as $id) {
                    $user = User::find($id);
                    $user->delete();
                }
                return response()->json([
                            'status' => 1,
                            'msg' => 'Seçilen kullanıcılar başarılı bir şekilde silindi'
                ]);
            } else {
                return response()->json([
                            'status' => 0,
                            'msg' => 'Bu işlemi gerçekleştirmek için yeterli yetkiniz bulunmamaktadır.'
                ]);
            }
        } else {
            return response()->json([
                        'status' => 0,
                        'msg' => 'Teknik bir hata meydana geldi.'
            ]);
        }
    }

    public function changeUserPanel(Request $request){
        $user = User::find(Auth()->user()->id);
        $user->panel_type = $request->panel_type;
        $user->save();
        return true;
    }

}
