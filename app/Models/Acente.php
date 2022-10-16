<?php

namespace App\Models;

use http\Env\Request;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Models\User;

class Acente extends Model
{
    protected $table = 'acente';
    protected $primaryKey = 'id';
    protected $fillable = [
        'e_mail',
        'acente_name',
        'competent_name',
        'phone',
        'tursab_no',
        'uyelik_bitis_tarihi',
        'created_at',
        'updated_at',
    ];

    public function acente() {
        return $this->hasMany('App\Models\User', 'acente_id', 'id');
    }

    public function lenght(Request $request){
        $acente_id = Auth()->user()->acente_id;
        $date = Acente::where('id',$acente_id)->first();
        $end = Carbon::parse($date->uyelik_bitis_tarihi);
        $length = $end->diffInDays(Carbon::now()->toDateString());
        return $length;
    }


}
