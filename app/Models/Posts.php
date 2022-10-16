<?php
namespace App\Models;

use Auth;
use DB;
use Illuminate\Database\Eloquent\Model;

class Posts extends Model{

    protected $table = 'posts';
    protected $primaryKey = 'id';
    protected $fillable = [
        'parent_id',
        'content',
        'created_at',
        'updated_at',
    ];

    public function posts(){
        return $this->belongsTo(Tours::class, 'parent_id','id');
    }

    public static function post(){
        $posts = Posts::groupBy('parent_id')->toSql();
        return $posts;
    }

}
