<?php

namespace App\Http\Controllers\Admin;

use App\Mail\UpdateTourMail;
use App\Models\Acente;
use App\Models\TourType;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Posts;
use App\Models\ToursDate;
use App\Models\Tours;
use App\Models\UpdatedTours;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\UpdateTourMail as TourMail;

class ToursController extends Controller{

    public function index(Request $request){
        $user = $request->user();
        if($user->hasRole(['admin', 'moderator'])){
            $tours = Tours::when($request->input('start_date'), function($query)use($request){
                return $query->where('sdadsa', $request->start_date);
            })
            ->paginate(20);
        }else{
            $tours = Tours::where('acente_id', Auth()->user()->acente_id)->paginate(20);
        }
        $tour_type = TourType::get();
        return view('admin.tours.index',[
           'title' => 'Tur Listesi',
            'user' => $user,
            'tours' => $tours,
            'tour_type' => $tour_type
        ]);
    }

    public function getCustomerByNonUser($check_permission, $request){
        $tours = Tours::when($check_permission == false, function($query) {
            return $query->where('user_id', Auth()->user()->id);
        })
            ->when($request->has('q') &&  $request->filled('q'), function($query) use ($request){
                return $query->where('tours_name', 'like', $request->q.'%');
            })
            ->orderBy('created_at', 'DESC')
            ->paginate(10);

        return $tours;
    }
    //Tur Ekleme Sayfası
    public function add(){
        $user_name= Auth()->user();
        $acenteler=Acente::All();
        $tour_type=TourType::All();
        return view('admin.tours.add',[
            'title' => 'Yeni Tur Oluştur',
            'user' => $user_name,
            'acenteler' => $acenteler,
            'tour_type' => $tour_type
        ]);
    }

    //Tur Ekleme POST
    public function addProcess(Request $request){
        $validator = Validator::make($request->all(), [
            'tours_name' => ['required'],
            'tour_type' => ['required'],
        ]);

        if ( $validator->fails() ) {
            return redirect()
                ->back()
                ->withErrors($validator)
                ->withInput();
        }
        $unique=(uniqid());
        $insert_data=[
            'tours_name' => $request->input('tours_name'),
            'tour_type' => $request->input('tour_type'),
            'acente_id' => $request->input('acente'),
            'unique_id' => $unique,
            'user_id' => Auth()->user()->id
        ];
        $acente_id=Auth()->user()->acente_id;
        if( $request->input('acente') ){
            $insert_data['acente_id'] = $request->input('acente');
        }else{
            $insert_data['acente_id'] = $acente_id;
        }
        $post = Tours::create($insert_data);
        if( $post == TRUE ){
            //Tarih ve Fiyat Bilgiler

            if($request->input('dates')){
                $dates = $request->dates;
                foreach ( $dates as $date ){
                    $explode_date = explode("/",$date['date_range']);
                    $insert_dates=[
                        'start_date' => $explode_date[0],
                        'end_date' => $explode_date[1],
                        'price' => $date['price'],
                        'tours_id' => $post->id
                    ];
                     ToursDate::create($insert_dates);
                }
            }

            //İçerik Bilgileri
            if( $request->input('contents') ){
                $contents = $request->contents;
                foreach ( $contents as $content ) {
                    $insert_content=[
                        'content' =>strip_tags($content['content']),
                        'parent_id' => $post->id
                    ];
                    Posts::create($insert_content);
                }
            }
            return redirect()->route('admin.tour.edit',['id'=>$post->id])->with([
                'status' => 1,
                'msg' => "Tur Başarılı Bir Şekilde Eklendi",
            ]);
        }
        else{
            return back()->withInput([
            'id' => $post->id,
            'msg' => 'Tur Oluşturulamadı.Bilgileri Kontrol Ediniz.' ,
            'status' =>  2
        ]);
        }

    }

    public function updateStatus(Request $request){
        if( $request->status && $request->tour_id ){
            $tour_id = $request->tour_id;
            Tours::where('id', $tour_id)->update([
                'status' => $request->status
            ]);
            return response()->json([
                'status' => 1,
                'msg' => 'Tur başarılı şekilde güncellendi'
            ]);
        }else{
            return response()->json([
                'status' => 0,
                'msg' => 'Bilinmeyen bir hata oluştu.'
            ]);
        }
    }

    public function edit($id){
        $tour = Tours::find($id);
        $title = '#'.$tour->id.' No\'lu Tur Düzenleme';
        $acenteler=Acente::All();
        $tours_type = TourType::All();
        if( $tour ){
            return view('admin.tours.edit', compact('tour', 'title','acenteler','tours_type'));
        }else{
            abort(404);
        }
    }

    public function editProcess(Request $request){
        $validator = Validator::make($request->all(), [
            'tours_name' => ['required'],
            'tour_type' => ['required'],
        ]);

        if ( $validator->fails() ) {
            return redirect()
                ->back()
                ->withErrors($validator)
                ->withInput();
        }
        $update_data=[
            'tours_name' => $request->input('tours_name'),
            'tour_type' => $request->input('tour_type'),
            'user_id' => Auth()->user()->id
        ];

        if($request->input('tours_id')) {
            $id=$request->input('tours_id');
            $post = Tours::where('id',$id)->update($update_data);
            Posts::where('parent_id',$id)->forceDelete();
            if( $post == TRUE ){
                //İçerik Düzenleme
                if( $request->input('contents') ){
                    $contents = $request->contents;
                    foreach ( $contents as $content ) {
                        if( !empty($content['content']) ){
                            $update_content=[
                                'content' =>strip_tags($content['content']),
                                'parent_id' => $id
                            ];
                           $date_content = Posts::create($update_content);
                        }
                    }
                }
                //Tarih ve Fiyat Düzenleme
                ToursDate::where('tours_id',$id)->forceDelete();
                if( $request->input('dates') ){
                    $dates = $request->dates;
                    foreach ( $dates as $date ) {
                        if( !empty($date['date_range'] && $date['price'])  ){
                            $explode_date = explode("/",$date['date_range']);
                            $insert_dates=[
                                'start_date' => $explode_date[0],
                                'end_date' => $explode_date[1],
                                'price' => $date['price'],
                                'tours_id' => $id
                            ];
                            ToursDate::create($insert_dates);
                        }
                    }
                }

                //Güncellenen Tur Ekleme ve Mail Gönderme
                if( $date_content ){
                    $tour_mail =[
                        'tours_id' => $id,
                        'message' => $id.' no\'lu Tur Güncellenmiştir.Tur\'u görüntüleyebilirsiniz.'
                    ];
                     UpdatedTours::create($tour_mail);
                    Mail::to('ensar@jsonyazilim.com')->send(new UpdateTourMail($tour_mail));
                }

                return redirect()->route('admin.tour.edit',['id'=>$id])->with([
                    'status' => 1,
                    'msg' => "Tur Başarılı Bir Şekilde Düzenlendi",
                ]);
            }
            else{
                return back()->withInput([
                    'id' => $post->id,
                    'title' => 'Tur Düzenle' ,
                    'msg' => 'Tur Oluşturulamadı.Bilgileri Kontrol Ediniz.' ,
                    'status' =>  2
                ]);
            }
        }
    }

    //Güncellenen Turların Görüntülenmesi

    public function updated_tours(){
        $updated_tours=UpdatedTours::get();
        return view('admin.tours.updated_tours',[
            'title' => 'Güncellenen Turlar',
            'updated_tours' => $updated_tours
        ]);
    }

    //Tur Tipi Ekleme

    public function addTourType(Request $request){
        TourType::create([
            'tour_type' => $request->tour_type
        ]);
        return response()->json([
            'status' => 1,
            'msg' => 'Tur Türü başarılı bir şekilde eklenmiştir.'
        ]);
    }
    public function edit_type($id){
        $type = TourType::find($id);
        $title = '#'.$type->id.' No\'lu Tur Tipi Düzenleme';
        if( $type ){
            return view('admin.tour_type.edit', compact('type', 'title'));
        }else{
            abort(404);
        }
    }
    public function editProcess_type(Request $request)
    {
        if($request->input('tour_type')){
            $validator = Validator::make($request->all(), [
                'tour_type' => ['required'],
            ]);

            if ($validator->fails()) {
                return redirect()
                    ->back()
                    ->withErrors($validator)
                    ->withInput();
            }
            $id=$request->input('tour_type_id');
            $insert_data = [
                'tour_type' => $request->input('tour_type'),
            ];

            $post = TourType::where('id',$id)->update($insert_data);
            if ($post == TRUE) {
                return redirect()->route('admin.tour_type.edit',['id'=>$id])->with([
                    'status' => 1,
                    'msg' => "Tur Tipi Başarılı Bir Şekilde Düzenlendi",
                ]);
            }
        }
    }
    // Tur Tipi Silme
    public function delTourType(Request $request) {
        $user = $request->user();

        if ($request->input('type_id')) {
            $type_id = $request->input('type_id');
            $type_count = TourType::where('id', $type_id)->count();
            if ($type_count > 0) {
                $type = TourType::find($type_id);
                $type->delete();
                return response()->json([
                    'status' => 1,
                    'msg' => 'Tur tipi başarılı bir şekilde silindi'
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'msg' => 'Herhangi bir hatırlatma bulunamadı.'
                ]);
            }
        } else {
            return response()->json([
                'status' => 0,
                'msg' => 'Teknik bir hata meydana geldi.'
            ]);
        }

    }


    public function del(Request $request) {
        $user = $request->user();
        if( $user->can('can-delete-tours') ){
            if ($request->input('id')) {
                $tour_id = $request->input('id');
                $tour_count = Tours::where('id', $tour_id)->count();
                if ($tour_count > 0) {
                    $tours = Tours::find($tour_id);
                    $tours->delete();
                    return response()->json([
                        'status' => 1,
                        'msg' => 'Tur başarılı bir şekilde silindi'
                    ]);
                } else {
                    return response()->json([
                        'status' => 0,
                        'msg' => 'Herhangi bir hatırlatma bulunamadı.'
                    ]);
                }
            } else {
                return response()->json([
                    'status' => 0,
                    'msg' => 'Teknik bir hata meydana geldi.'
                ]);
            }
        }else{
            return response()->json([
                'status' => 0,
                'msg' => 'Tur kaydını silme işlemi için yeterli yetkiniz bulunmamaktadır.'
            ]);
        }
    }

}
