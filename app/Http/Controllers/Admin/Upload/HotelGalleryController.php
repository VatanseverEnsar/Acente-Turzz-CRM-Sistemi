<?php

namespace App\Http\Controllers\Admin\Upload;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;

class HotelGalleryController extends Controller {

    public function doUpload(Request $request) {
        $request->validate([
            'gallery_items' => ['mimes:jpeg,jpg,png,gif|required|max:10000'],
        ]);
        $image = $request->file('gallery_items');
        $image_name = rand() . '.' . $image->getClientOriginalExtension();
        $update_image = $image->move(public_path('userfiles/gallery'), $image_name);
        if ($update_image) {

            return response()->json([
                        'msg' => 'Resim başarılı bir şekilde eklendi.',
                        'status' => 1,
                        'image_url' => url('userfiles/gallery/'.$image_name),
                        'image_name' => $image_name
            ]);
        }
    }

    public function removeUpload(Request $request) {
        $fileName = $request->input('fileName');
        unlink(public_path('userfiles/gallery/' . $fileName));
        return response()->json([
                    'status' => 1,
                    'msg' => 'Galeri resmi başarılı bir şekilde silindi',
                    'image_name' => $fileName
        ]);
    }

}
