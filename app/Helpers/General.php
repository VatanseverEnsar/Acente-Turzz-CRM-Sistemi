<?php

namespace App\Helpers;

use App\Models\BidProducts;
use App\Models\Call;
use App\Models\City;
use App\Models\Customers;
use App\Models\Database\UserRoles;
use App\Models\Products;
use App\Models\Tours;
use App\Models\Town;
use DB;
use App\Models\Roles;

class General{
    public static function setToursStatusTitle($key){
        $status[1]['title'] = 'Aktif';
        $status[2]['title'] = 'Pasif';

        return $status[$key]['title'];
    }
    public static function setContStatusTitleByKey($key) {
        $status[1]['title'] = 'Beklemede';
        $status[2]['title'] = 'Onaylandı';
        $status[3]['title'] = 'Sorunlu';
        $status[4]['title'] = 'Programda';
        $status[5]['title'] = 'Montaj';
        $status[6]['title'] = 'İptal';

        return $status[$key]['title'];
    }
    public static function setContEarningTitleByKey($key) {
        $status[1]['title'] = 'Lead';
        $status[2]['title'] = 'Selfgen';
        $status[3]['title'] = 'PSN';
        $status[4]['title'] = 'Marka Temsilcisi';

        return $status[$key]['title'];
    }
    public static function setAppointmentRefuseTitleByKey($key) {
        $status[1]['title'] = 'Mevcut Sistemi Var';
        $status[2]['title'] = 'Alarm İhtiyacı Yaratılamadı';
        $status[3]['title'] = 'Fiyat Pahalı Geldi';
        $status[4]['title'] = 'Rakibe Kaybedildi';
        $status[5]['title'] = 'Pronet Olumsuz Tecrübe';
        $status[6]['title'] = 'Taahhüt Vermek İstemiyor';
        $status[7]['title'] = 'Aylık Abonelik İstemiyor';

        return $status[$key]['title'];
    }

    public static function setBidTypeTitleByKey($key) {
        $status[1]['title'] = 'Bireysel';
        $status[2]['title'] = 'Kurumsal';

        return $status[$key]['title'];
    }
    public static function setPackagesTitleByKey($key) {
        $status[1]['title'] = 'AMG';
        $status[2]['title'] = 'Pronet';
        $status[3]['title'] = 'Pronet Plus';
        $status[4]['title'] = 'Kameram';
        $status[5]['title'] = 'Kameram Pro';

        return $status[$key]['title'];
    }
    public static function setCampaignTitleByKey($key){
        $status[1]['title']='Move in';
        $status[2]['title']='Kayıp Move in';
        $status[3]['title']='Giriş Bedelsiz';

        return $status[$key]['title'];
    }


    public static function setClassByKey($key) {
        $status[0]['class'] = 'gray';
        $status[1]['class'] = 'primary';
        $status[2]['class'] = 'warning';
        $status[3]['class'] = 'info';
        $status[4]['class'] = 'dark';
        $status[5]['class'] = 'danger';
        $status[6]['class'] = 'success';

        return $status[$key]['class'];
    }

    public static function setSourceTitleByKey($key) {
        $status[1]['title'] = 'Referans';
        $status[2]['title'] = 'Lead';
        $status[3]['title'] = 'İto Datası';
        $status[4]['title'] = 'Data';
        $status[5]['title'] = 'Kartvizit';
        $status[6]['title'] = 'Marka Temsilcisi';

        return $status[$key]['title'];
    }

    public static function setCheckupTitleByKey($key) {
        $status[0]['title'] = 'Konut';
        $status[1]['title'] = 'İş Yeri';

        return $status[$key]['title'];
    }

    public static function setStatusClassByKey($key) {
        $status[0]['class'] = 'success';
        $status[1]['class'] = 'warning';
        $status[2]['class'] = 'danger';
        $status[3]['class'] = 'info';
        $status[4]['class'] = 'dark';
        $status[5]['class'] = 'primary';

        return $status[$key]['class'];
    }

    public static function setStatusTitleByKey($key) {
        $status[0]['title'] = 'Aranacak';
        $status[1]['title'] = 'Ulaşılamadı';
        $status[2]['title'] = 'Red';
        $status[3]['title'] = 'Yanlış Numara';
        $status[4]['title'] = 'Blacklist';
        $status[5]['title'] = 'Randevu Alındı';

        return $status[$key]['title'];
    }

    public static function getCallSellResult($value){
        $text = "";
        switch ($value) {
            case 1:
                $text = "Randevu Alındı";
                break;
            case 2:
                $text = "Tekrar Aranacak";
                break;
            case 3:
                $text = "Red";
                break;
            case 4:
                $text = "Ulaşılamadı";
                break;
            case 5:
                $text = "Yanlış Numara";
                break;
            case 6:
                $text = "Meşgule Attı";
                break;
            case 7:
                $text = "Meşgul";
                break;
            default:
                break;
        }
        return $text;
    }

    public static function getCallComplainResult($value){
        $text = "";
        switch ($value) {
            case 1:
                $text = "Sorun Giderildi";
                break;
            case 2:
                $text = "Sorun Giderilemedi";
                break;
            case 3:
                $text = "Red";
                break;
            case 4:
                $text = "Ulaşılamadı";
                break;
            case 5:
                $text = "Yanlış Numara";
                break;
            case 6:
                $text = "Meşgule Attı";
                break;
            case 7:
                $text = "Meşgul";
                break;
            default:
                break;
        }
        return $text;
    }

    public static function setCallSellClassByKey($key) {

        $status[1]['class'] = 'success';
        $status[2]['class'] = 'warning';
        $status[3]['class'] = 'danger';
        $status[4]['class'] = 'dark';
        $status[5]['class'] = 'info';
        $status[6]['class'] = 'primary';
        $status[7]['class'] = 'gray';

        return $status[$key]['class'];
    }

    public static function setCallComplainClassByKey($key){
        $status[1]['class'] = 'success';
        $status[2]['class'] = 'warning';
        $status[3]['class'] = 'danger';
        $status[4]['class'] = 'dark';
        $status[5]['class'] = 'info';
        $status[6]['class'] = 'primary';
        $status[7]['class'] = 'gray';

        return $status[$key]['class'];
    }

    public static function setReminderClass($key){
        $status[1]['class'] = 'success';
        $status[2]['class'] = 'warning';
        $status[3]['class'] = 'danger';
        $status[4]['class'] = 'info';
        $status[5]['class'] = 'primary';

        return $status[$key]['class'];
    }

    public static function setReminderTitle($key){
        $status[1]['title'] = 'Arama';
        $status[2]['title'] = 'Ziyaret';
        $status[3]['title'] = 'Toplantı';
        $status[4]['title'] = 'Eğitim';
        $status[5]['title'] = 'Diğer';

        return $status[$key]['title'];
    }

    public static function setAppointmentClass($key){
        $status[1]['class'] = 'success';
        $status[2]['class'] = 'warning';
        $status[3]['class'] = 'danger';
        $status[4]['class'] = 'info';
        $status[5]['class'] = 'primary';

        return $status[$key]['class'];
    }

    public static function setAppointmentTitle($key){
        $status[1]['title'] = 'Satış Görüşmesi';
        $status[2]['title'] = 'Montaj Ziyareti';
        $status[3]['title'] = 'Referans İsteme';
        $status[4]['title'] = 'Sözleşme Tamamlama';
        $status[5]['title'] = 'Moi Ziyareti';

        return $status[$key]['title'];
    }

    public static function setAppointmentResultTitle($key){
        $status[1]['title'] = 'Yeni Kayıt';
        $status[2]['title'] = 'Yakında Sonuçlanacak';
        $status[3]['title'] = 'Sunum Tamamlanamadı';
        $status[4]['title'] = 'Satış';
        $status[5]['title'] = 'Red';
        $status[6]['title'] = 'Müşteri Yok';
        $status[7]['title'] = 'Ertelendi';

        return $status[$key]['title'];
    }

    public static function setAppointmentResultClass($key){
        $status[1]['class'] = 'primary';
        $status[2]['class'] = 'warning';
        $status[3]['class'] = 'info';
        $status[4]['class'] = 'success';
        $status[5]['class'] = 'danger';
        $status[6]['class'] = 'dark';
        $status[7]['class'] = 'gray';

        return $status[$key]['class'];
    }
    public static function setContractResultClass($key){
        $status[1]['class'] = 'warning';
        $status[2]['class'] = 'success';
        $status[3]['class'] = 'danger';
        $status[4]['class'] = 'info';
        $status[5]['class'] = 'dark';

        return $status[$key]['class'];
    }

    public static function getToursNameById($id){
        $tours = Tours::where('id', $id)->first();
        return $tours->tours_name;
    }

    public static function getUserRoleName($user_id){
        $user_role = UserRoles::where('user_id', $user_id)->first();
        $role = DB::table('roles')->where('id', $user_role->role_id)->first();
        return $role->name;
    }

    public static function getProductValue($place_id, $product_key){
        $product = BidProducts::where('place_id', $place_id)->where('product_key', $product_key)->first();
        if( $product ){
            return $product->product_value;
        }else{
            return 0;
        }
    }

    public static function getProductNameById($product_id){
        $product = Products::find($product_id);
        return $product->name;
    }

    public static function money($money){
        return number_format($money,2, ',', '.');
    }

    public static function setCampaign($campaign){
        switch ($campaign) {
            case 1:
                echo "Hoşgeldiniz Kampanyası";
                break;
            case 2:
                echo "Move - in";
                break;
            case 3:
                echo "Kayıp Move -in";
                break;
            case 4:
                echo "Win Back";
                break;
            case 5:
                echo "Devir";
                break;
            case 6:
                echo "Giriş Bedelsiz";
                break;
            case 7:
                echo "Eko";
                break;
            default:
                echo "Belirlenmedi.";
        }
    }

    public static function setAddressToText($address){
        $html = "";
        if( $address->neighborhood != NULL ){
            $html .= $address->neighborhood.' Mah. ';
        }
        if( $address->quarter != NULL ){
            $html .= $address->quarter.' Sok. ';
        }
        if( $address->street != NULL ){
            $html .= $address->street.' Cd. ';
        }
        if( $address->apartment_no != NULL && $address->door_no != NULL ){
            $html .= 'No: '.$address->apartment_no.'/'.$address->door_no.' ';
        }
        if( $address->district_id != NULL ){
            $html .= Town::getTownNameById($address->district_id);
        }
        if( $address->city_id != NULL ){
            $html .= '-'.City::getCityNameById($address->city_id);
        }
        return $html;
    }

    public static function getCallStatusResult($customer_id){
        $call = Call::where('customer_id', $customer_id)->orderBy('created_at', 'DESC')->first();
        if( $call ){
            return $call;
        }
        return false;
    }
}



