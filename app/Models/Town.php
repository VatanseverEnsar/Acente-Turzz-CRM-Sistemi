<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Town extends Model
{
    protected $table = 'town';
    protected $primaryKey = 'townID';

    public static function getTownNameById($id){
        return self::find($id)->TownName;
    }
}
