<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\RezervationMail;
use App\Models\Acente;
use App\Models\Tours;
use App\Support\Collection;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Auth;

class RezervationController extends  Controller{

    public function index(Request $request){
        $client = new Client();
        $user = $request->user();
        if( $user->hasRole(['admin'])){
            $response = $client->request('GET', 'https://www.turzz.com/tour-api');
            $reservation_data = json_decode($response->getBody(), TRUE);
            $reservations = $this->convertReservations($reservation_data);
            $title = 'Rezervasyon Listesi';
            return view('admin.reservation.index', compact('reservations', 'title'));
        }else{
            $title = 'Rezervasyon Listesi';
            $agent = Acente::find(Auth()->user()->id);
            if( !empty($agent->id) ){
                $params = [
                    'agent_id' => $agent->id
                ];
                $response = $client->request('GET', 'https://www.turzz.com/tour-api', $params);
                $reservation_data = json_decode($response->getBody(), TRUE);
                $reservations = $this->convertReservations($reservation_data);
                $title = 'Rezervasyon Listesi';
                return view('admin.reservation.index', compact('reservations', 'title'));
            }else{
                return view('admin.reservation.index', compact('title'));
            }
        }


    }

    public function convertReservations($reservations){
        $reservation_data = new Collection();
        foreach( $reservations as $reservation ){
            $tour = Tours::where('unique_id', $reservation['code'])->first();
            if( $tour ){
                $data = [
                    'id' => $reservation['id'],
                    'full_name' => $reservation['name'],
                    'email' => $reservation['email'],
                    'message' => $reservation['message'],
                    'sale_price' => number_format($reservation['tour_sale_price'], 2),
                    'regular_price' => number_format($reservation['tour_regular_price'], 2),
                    'tour_name' => $reservation['tour_name'],
                    'agent' => $tour->acente->acente_name ?? $tour->acente->acente_name,
                    'tour_date' => \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $reservation['created_at'])->isoFormat('DD MMMM YYYY, dddd'),
                    'tour_type' => $tour->tour_type_id->tour_type,
                ];
                $reservation_data->push($data);
            }

        }
        return $reservation_data->paginate(15);
    }

}
