<?php

namespace App\Models;

use Auth;
use DB;
use Illuminate\Database\Eloquent\Model;

class Tours extends Model
{
    protected $table = 'tours';
    protected $primaryKey = 'id';
    protected $fillable = [
        'user_id',
        'tours_name',
        'tours_type',
        'acente_id',
        'tour_type',
        'status',
        'unique_id',
        'created_at',
        'updated_at',
    ];

    public function posts() {
        return $this->hasMany(Posts::class, 'parent_id', 'id');
    }

    public function userdate() {
        return $this->hasMany(Posts::class, 'tours_id', 'id');
    }

    public function user(){
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function tour_type_id(){
        return $this->belongsTo(TourType::class, 'tour_type','id');
    }

    public function acente(){
        return $this->belongsTo(Acente::class, 'acente_id','id');
    }

    public static function getCustomers($data, $datatable, $sort) {
        $keyword = isset($data['generalSearch']) ? $data['generalSearch'] : false;
        $sorting = isset($sort) ? $sort : false;
    }

}
