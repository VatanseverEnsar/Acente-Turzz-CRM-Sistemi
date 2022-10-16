<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $table = 'city';
    protected $primaryKey = 'CityID';

    public function country(){
        return $this->belongsTo(Country::class);
    }

    public function towns(){
        return $this->hasMany(Town::class, 'CityID');
    }
    public function customers_adress(){
        return $this->hasMany(CustomersAdress::class, 'city_id');
    }

    public static function getCityNameById($id){
        return self::find($id)->CityName;
    }

}
