<?php
namespace App\Models;

use Auth;
use DB;
use Illuminate\Database\Eloquent\Model;

class UpdatedTours extends Model{

    protected $table = 'updated_tours';
    protected $primaryKey = 'id';
    protected $fillable = [
        'tours_id',
        'message',
        'created_at',
        'updated_at',
    ];

    public function updated_tours(){
        return $this->belongsTo(Tours::class, 'tours_id','id');
    }

}
