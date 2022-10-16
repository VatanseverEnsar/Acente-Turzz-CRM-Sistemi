<?php

use App\Models\Roles;

if (!function_exists('get_roles')) {

    function get_roles() {
        $roles = Roles::all();
        $array = [];
        foreach ($roles as $role) {
            array_push($array, $role->slug);
        }
        $roles = implode('|', $array);
        return $roles;
    }

}

if (!function_exists('customer_contracts')) {

    function customer_contracts($bids) {
        $i = 0;
        if( $bids ){
            foreach( $bids as $bid ){
                $contracts = \App\Models\Contract::where('bid_id', $bid->id)->get();
                foreach( $contracts as $contract ){
                    $i += 1;
                }
            }
            return $i;
        }

        return 0;
    }

}

if (!function_exists('customer_references')) {

    function customer_references($customer) {
        $count = \App\Models\Customers::where('giver_reference', $customer->customer_id)->count();
        return $count;
    }

}
