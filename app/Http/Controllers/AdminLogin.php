<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;

class AdminLogin extends Controller {

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    public function __construct() {
        
    }

    public function index() {
        $user = Auth::check();
        if( $user ){
            return redirect('admin/dashboard');
        }else{
            return view('admin/login');
        }
        
    }

    public function login_proccess(Request $request) {
        
        Validator::make($request->all(), [
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
        ])->validate();
        
        $credentials = $request->only('email', 'password');
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $user = $request->user();
            if ($request->user()->hasRole(['admin', 'helper', 'editor'])) {
                return redirect()->intended('admin/dashboard');
            }else{
                Auth::logout();
                return Redirect::back()->withErrors(['E-posta ya da şifre yanlıştır. Lütfen tekrar deneyiniz']);
            }
        }else{
            return Redirect::back()->withErrors(['E-posta ya da şifre yanlıştır. Lütfen tekrar deneyiniz']);
        }
    }

}
