<?php

namespace App\Models;

use Auth;
use DB;
use Illuminate\Database\Eloquent\Model;
class TourType extends Model{

    protected $table = 'tour_type';
    protected $primaryKey = 'id';
    protected $fillable = [
        'tour_type',
        'created_at',
        'updated_at',
    ];

}
