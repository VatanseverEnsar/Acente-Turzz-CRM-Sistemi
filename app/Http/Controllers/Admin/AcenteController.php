<?php

namespace App\Http\Controllers\Admin;

use App\Models\UsersMeta;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Database\UserRoles;
use App\Models\Acente;
use App\Models\TourType;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class AcenteController extends Controller
{
    public function index(Request $request){
        $user = $request->user();
        $check_permission = $user->can('can-access-all-acente');
     //   $acente=  $this->getCustomerByNonUser($check_permission, $request);
        $users=User::paginate(15);
        return view('admin.acente.index',[
            'title' => 'Acente Listesi',
            'users' => $users,
        ]);
    }

    public function add(){
        return view('admin.acente.add',[
            'title' => 'Yeni Acente Oluştur',
        ]);
    }

    public function addProcess(Request $request){
        $validator = Validator::make($request->all(), [
            'acente_name' => ['required'],
            'uyelik_bitis_tarihi' => ['required'],
            'e_mail' => ['required'],
            'competent_name' => ['required'],
            'phone' => ['required'],
            'tursab_no' => ['required']
        ]);

        if ( $validator->fails() ) {
            return redirect()
                ->back()
                ->withErrors($validator)
                ->withInput();
        }
        $insert_data=[
            'acente_name' => $request->input('acente_name'),
            'phone' => $request->input('phone'),
            'tursab_no' => $request->input('tursab_no'),
            'uyelik_bitis_tarihi' => $request->input('uyelik_bitis_tarihi'),
        ];

        $post = Acente::create($insert_data);
        if( $post == TRUE ){
            $insert_user=[
                'name' => $request->input('competent_name'),
                'email' => $request->input('e_mail'),
                'email_verified_at' => date('Y-m-d H:i:s'),
                'password' => Hash::make($request->input('password')),
                'acente_id' => $post->id
            ];
            $create_user = User::Create($insert_user);

            if( $create_user ){
                UserRoles::create([
                    'user_id' => $create_user->id,
                    'role_id' => 3
                ]);
                $user_name = explode(" ",$create_user->name);
                UsersMeta::create([
                    'user_id' => $create_user->id,
                    'first_name' => $user_name[0],
                    'last_name' => $user_name[1],
                    'phone' => $request->input('phone'),
                ]);
            }

            return redirect()->route('admin.acente.edit',['id'=>$post->id])->with([
                'status' => 1,
                'msg' => "Acente Başarılı Bir Şekilde Eklendi",
            ]);
        }
        else{
            return back()->withInput([
                'id' => $post->id,
                'msg' => 'Acente Oluşturulamadı.Bilgileri Kontrol Ediniz.' ,
                'status' =>  2
            ]);
        }
    }

    public function edit($id){
        $acente = Acente::find($id);
        $user = User::where('acente_id',$id)->first();

        $title = '#'.$acente->id.' No\'lu Acente Düzenleme';
        if( $acente ){
            return view('admin.acente.edit', compact('acente','user', 'title'));
        }else{
            abort(404);
        }
    }

    public function editProcess(Request $request)
    {
        if($request->input('acente_id')){
            $validator = Validator::make($request->all(), [
                'acente_name' => ['required'],
                'competent_name' => ['required'],
                'phone' => ['required'],
                'e_mail' => ['required'],
                'tursab_no' => ['required'],
                'uyelik_bitis_tarihi' => ['required'],
            ]);

            if ($validator->fails()) {
                return redirect()
                    ->back()
                    ->withErrors($validator)
                    ->withInput();
            }
            $id=$request->input('acente_id');
            $insert_data = [
                'acente_name' => $request->input('acente_name'),
                'competent_name' => $request->input('competent_name'),
                'phone' => $request->input('phone'),
                'e_mail' => $request->input('e_mail'),
                'tursab_no' => $request->input('tursab_no'),
                'uyelik_bitis_tarihi' => $request->input('uyelik_bitis_tarihi'),
            ];

            $post = Acente::where('id',$id)->update($insert_data);
            if ($post == TRUE) {
                return redirect()->route('admin.acente.edit',['id'=>$id])->with([
                    'status' => 1,
                    'msg' => "Acente Başarılı Bir Şekilde Düzenlendi",
                ]);
            }
            else{
                return back()->withInput([
                    'id' => $post->id,
                    'title' => 'Acente Düzenle' ,
                    'msg' => 'Acente Düzenlenemedi.Bilgileri Kontrol Ediniz.' ,
                    'status' =>  2
                ]);
            }
        }
    }

    public function del(Request $request) {
        $user = $request->user();
        if( $user->can('can-delete-acente') ){
            if ($request->input('acente_id')) {
                $acente_id = $request->input('acente_id');
                $acente_count = Acente::where('id', $acente_id)->count();
                if ($acente_count > 0) {
                    $acente = Acente::find($acente_id);
                    $acente->delete();
                    return response()->json([
                        'status' => 1,
                        'msg' => 'Tur başarılı bir şekilde silindi'
                    ]);
                } else {
                    return response()->json([
                        'status' => 0,
                        'msg' => 'Herhangi bir hatırlatma bulunamadı.'
                    ]);
                }
            } else {
                return response()->json([
                    'status' => 0,
                    'msg' => 'Teknik bir hata meydana geldi.'
                ]);
            }
        }else{
            return response()->json([
                'status' => 0,
                'msg' => 'Tur kaydını silme işlemi için yeterli yetkiniz bulunmamaktadır.'
            ]);
        }
    }
}
