<?php

namespace App\Http\Controllers\Admin;

use App\Models\Customers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Validator;
use App\Notifications\contactMessage;


class AdminController extends Controller {

    public function __construct() {

    }

    public function contact() {
        return view('admin.support', [
            'title' => 'İletişim | Marka Temsilci Satış Portalı'
        ]);
    }

    public function editContent(Request $request){

        if( $request->action == "customer"){
            Customers::where('customer_id', $request->id)->update([
                $request->key => $request->value
            ]);
            return response()->json([
               'status' => 1,
               'type' => "success",
               'msg' => 'Müşteri başarılı bir şekilde güncellendi'
            ]);
        }
    }

    public function logout() {
        Auth::logout();
        return redirect('admin/login');
    }

}
