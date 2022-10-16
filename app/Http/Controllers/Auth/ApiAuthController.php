<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Auth_Sessions;
use App\Models\ApiModel;
use Artisaninweb\SoapWrapper\SoapWrapper;
use App\Soap\Request\GetConversionAmount;
use App\Soap\Response\GetConversionAmountResponse;

class ApiAuthController extends Controller {

    protected $soapWrapper;

    public function __construct(SoapWrapper $soapWrapper) {
        $this->soapWrapper = $soapWrapper;
    }

    public function Login($auth_sess_id) {
        $ApiModel = new ApiModel();
        $response = $ApiModel->Login($this->soapWrapper);
        Auth_Sessions::where('auth_sess_id', $auth_sess_id)->update([
            'b_sess_id' => $response->LoginResult->AuthenticationHeader->SessionId,
            'b_sess_token' => $response->LoginResult->AuthenticationHeader->SessionToken
        ]);
    }

    public function create_session(Request $request) {
        $auth_id = $request->session()->token();
        $ip_address = $request->server("REMOTE_ADDR");
        $user_agent = $request->server('HTTP_USER_AGENT');
        $check_session = Auth_Sessions::where('auth_sess_id', $auth_id)->count();
        if ($check_session < 1) {
            $create_session = Auth_Sessions::create([
                        'auth_sess_id' => $auth_id,
                        'ip' => $ip_address,
                        'user_agent' => $user_agent,
            ]);
            $this->Login($create_session->auth_sess_id);
            return response()->json([
                        'status' => 1,
                        '__auth' => $create_session->auth_sess_id,
            ]);
            exit();
        } else {
            $auth_session = Auth_Sessions::where('auth_sess_id', $auth_id)->first();
            return response()->json([
                        'status' => 1,
                        '__auth' => $auth_session->auth_sess_id
            ]);
        }
    }

}
