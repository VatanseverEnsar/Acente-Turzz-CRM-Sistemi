<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UsersMeta;
use App\Models\Acente;
use App\Models\TourType;
use Carbon\Carbon;
use Auth;

class ProfileController extends Controller {

    public function index(Request $request) {
        $user = User::find(Auth()->user()->id);
        $current_user = $request->user();
        $data = [
            'title' => 'Profile Bilgilerim',
            'user' => $user,
            'user_meta' => $user->user_meta,
            'acente' => $user->acente,
        ];

        if( $current_user->hasRole(['acente']) ) {
            $end = Carbon::parse($user->acente->uyelik_bitis_tarihi);
            $length = $end->diffInDays(Carbon::now()->toDateString());
            $data['length'] = $length;
        }
        return view('admin.profile.index', $data);
    }

    public function edit(Request $request) {
        $user_id = Auth()->user()->id;
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:500',
            'first_name' => 'required|max:500',
            'last_name' => 'required|max:500',
            'phone' => 'required'
        ]);

        if ($validator->fails()) {
            return redirect()
                ->route('admin.profile.index')
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
                'town' => $request->input('town')
            ];
            UsersMeta::where('user_id', $user_id)->update($update_meta_data);
            return redirect()->route('admin.profile.index')->with([
                'status' => 1,
                'msg' => 'Profil başarılı bir şekilde güncellendi'
            ]);
        }
    }

    public function indexAcente(Request $request) {
        $user = User::find(Auth()->user()->id);
        $tour_type = TourType::get();
        $current_user = $request->user();
        $data = [
            'title' => 'Profile Bilgilerim',
            'user' => $user,
            'user_meta' => $user->user_meta,
            'acente' => $user->acente,
            'tour_type' => $tour_type
        ];

        if( $current_user->hasRole(['acente']) ) {
            $end = Carbon::parse($user->acente->uyelik_bitis_tarihi);
            $length = $end->diffInDays(Carbon::now()->toDateString());
            $data['length'] = $length;
        }
        return view('admin.profile.acente', $data);
    }

    public function editAcente(Request $request) {
        $user_id = Auth()->user()->id;
        $validator = Validator::make($request->all(), [
            'acente_name' => 'required|max:500',
            'tursab_no' => 'required|max:500',
        ]);

        if ($validator->fails()) {
            return redirect()
                ->route('admin.profile.acente')
                ->withErrors($validator)
                ->withInput();
        }
        $update_acente = [
            'acente_name' => $request->input('acente_name'),
            'tursab_no' => $request->input('tursab_no'),
        ];
        Acente::where('id', Auth()->user()->acente_id)->update($update_acente);
        return redirect()->route('admin.profile.acente')->with([
            'status' => 1,
            'msg' => 'Profil başarılı bir şekilde güncellendi'
        ]);
    }

    public function changeUserPassword(Request $request) {
        $user = User::find(Auth()->user()->id);
        $user_meta = User::find(Auth()->user()->id)->user_meta;
        $tour_type = TourType::get();
        $data = [
            'title' => 'Şifre Güncelle | Marka Temsilci Satış Portalı',
            'user' => $user,
            'user_meta' => $user_meta,
            'tour_type' => $tour_type
        ];
        return view('admin.profile.password', $data);
    }

    public function changePasswordProcess(Request $request) {
        $user_id = Auth()->user()->id;
        $count_user = User::where('id', $user_id)->count();
        if ($count_user > 0) {
            $validator = Validator::make($request->all(), [
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            if ($validator->fails()) {
                return redirect()
                    ->route('admin.profile.password')
                    ->withErrors($validator)
                    ->withInput();
            }
            $password = $request->input('password');
            $update_data = [
                'password' => Hash::make($password)
            ];
            User::where('id', $user_id)->update($update_data);
            $user = User::find($user_id);
            Auth::login($user, true);
            return redirect()->route('admin.profile.password')->with([
                'status' => 1,
                'msg' => 'Şifre başarılı bir şekilde güncellendi'
            ]);
        } else {
            abort(404);
        }
    }

}
