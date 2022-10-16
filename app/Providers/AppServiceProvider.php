<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\ProductCategories;
use App\Models\Posts;
use App\Models\OrderStatus;
use Auth;
use Jenssegers\Agent\Agent;
use Illuminate\Support\Facades\Validator;

class AppServiceProvider extends ServiceProvider {

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register() {
        view()->composer('*', function($view) {
            $view->with([
                'agent' => new Agent(),
            ]);
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot() {
        Validator::extend('recaptcha', 'App\Validators\ReCaptcha@validate');
    }

}
