<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Jenssegers\Agent\Agent;
use App\Models\Town;
use DB;

class HomeController extends Controller {

    /**
     * Create a new controller instance.
     *
     * @return void
     */

    public function getTownByID(Request $request){
        if( $request->input('city_id') ){
            $city_id = $request->input('city_id');
            $towns = Town::where('CityID', $city_id)->get();
            return response()->json($towns);
        }else{
            abort(404);
        }
    }

}
