<?php
namespace App\Models;

use Auth;
use DB;
use Illuminate\Database\Eloquent\Model;

class ToursDate extends Model{

    protected $table = 'tours_date';
    protected $primaryKey = 'id';
    protected $fillable = [
        'tours_id',
        'start_date',
        'end_date',
        'price',
        'created_at',
        'updated_at',
    ];

    public function dates(){
        return $this->belongsTo(Tours::class, 'tours_id','id');
    }

}
