<?php

namespace App\Http\Controllers\Auth;

use App\User;
use App\Acente;
use Mail;
use App\Mail\Registration;
use App\Models\Database\UserRoles;
use App\Models\UsersMeta;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;
use Auth;

class RegisterController extends Controller {
    /*
      |--------------------------------------------------------------------------
      | Register Controller
      |--------------------------------------------------------------------------
      |
      | This controller handles the registration of new users as well as their
      | validation and creation. By default this controller uses a trait to
      | provide this functionality without requiring any additional code.
      |
     */

use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/profile';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware('auth');
    }

    public function showRegistrationForm() {
        $title = __('frontend.signup') . ' | ' . __('frontend.site_title');

        return view('auth.register', compact('title'));
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data) {
        return Validator::make($data, [
                    'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                    'password' => ['required', 'string', 'min:8', 'confirmed'],
                    'first_name' => ['required', 'string', 'max:255'],
                    'last_name' => ['required', 'string', 'max:255'],
                    'phone' => ['required', 'max:255'],
                    'city' => ['required'],
                    'terms' => 'accepted',
                    'kvkk' => 'accepted'
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data) {

            $user = User::create([
                'name' => $data['first_name'].' '.$data['last_name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),

            ]);
            $insert_id = $user->id;
            if ($user == TRUE) {
                $insert_meta_data = UsersMeta::create([
                    'user_id' => $insert_id,
                    'phone' => $data['phone'],
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'city' => isset($data['city']) ? $data['city'] : NULL,
                    'town' => isset($data['town']) ? $data['town'] : NULL
                ]);
                $insert_role = UserRoles::create([
                    'user_id' => $insert_id,
                    'role_id' => 2
                ]);
                if ($insert_role == TRUE) {
                    $admin = \App\Models\User::find(1);
                    $email_data = [
                        'name' => $user->name,
                        'email' => $user->email,
                        'user_id' => $user->id
                    ];
                    $to_email = $admin->email;

                    Mail::to($to_email)
                        ->send(new Registration($email_data));
                    return $user;
                }
                Auth::login($user);

        }
    }
    protected function createAcente(array $data) {

        $acente = Acente::create([
            'acente_name' => $data['acente_name'],
            'phone' => $data['phone'],
            'tursab_no' => $data['tursab_no'],
            'uyelik_bitis_tarihi' => $data['uyelik_bitis_tarihi'],
        ]);
        $insert_id = $acente->id;
        if ($acente == TRUE) {
            $insert_user = User::create([
                'name' => $data['competent_name'],
                'email' => $data['e_mail'],
                'password' => Hash::make($data['password']),
            ]);
            $insert_role = UserRoles::create([
                'user_id' => $insert_id,
                'role_id' => 3
            ]);
            if ($insert_role == TRUE) {
                $admin = \App\Models\User::find(1);
                $email_data = [
                    'name' => $insert_user->name,
                    'email' => $insert_user->email,
                    'user_id' => $insert_user->id
                ];
                $to_email = $admin->email;

                Mail::to($to_email)
                    ->send(new Registration($email_data));
                return $insert_user;
            }
            Auth::login($insert_user);

        }
    }
}
