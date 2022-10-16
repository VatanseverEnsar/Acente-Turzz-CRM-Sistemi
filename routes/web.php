<?php

/*
  |--------------------------------------------------------------------------
  | Web Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register web routes for your application. These
  | routes are loaded by the RouteServiceProvider within a group which
  | contains the "web" middleware group. Now create something great!
  |
 */
/********************
 * Can Tour
 ******************/
Route::group(['middleware' => 'role:' . get_roles() . ',can-add-tour'], function() {
    Route::get('/update-tour-status', 'Admin\ToursController@updateStatus');
    Route::get('/tours', 'Admin\ToursController@index')->name('admin.tour.index');
    Route::get('/add-tour', 'Admin\ToursController@add')->name('admin.tour.add');
    Route::post('/add-new-tour', 'Admin\ToursController@addProcess')->name('admin.tour.add.process');

    Route::get('/updated-tours', 'Admin\ToursController@updated_tours')->name('admin.updated_tours');
    Route::post('/tour-type/add', 'Admin\ToursController@addTourType')->name('admin.tour_type.add');

    Route::get('/reservations', 'Admin\RezervationController@index')->name('admin.reservations');
});

Route::group(['middleware' => 'role:' . get_roles() . ',can-edit-tour'], function() {
    Route::get('/edit-tour/{id}', 'Admin\ToursController@edit')->name('admin.tour.edit');
    Route::post('/edit-new-tour', 'Admin\ToursController@editProcess')->name('admin.tour.edit.process');
});

/********************
 * Can Acente
 ******************/
Route::group(['middleware' => 'role:' . get_roles() . ',can-add-acente'], function() {
    Route::get('/acente', 'Admin\AcenteController@index')->name('admin.acente.index');
    Route::get('/add-acente', 'Admin\AcenteController@add')->name('admin.acente.add');
    Route::post('/add-new-acente', 'Admin\AcenteController@addProcess')->name('admin.acente.add.process');
});

/********************
//Rezervasyon Görüntüleme
 *  ******************/
Route::group(['middleware' => 'role:' . get_roles() . ',can-access-all-rezervation'], function() {

    
});

Route::group(['middleware' => 'role:' . get_roles() . ',can-edit-acente'], function() {
    Route::get('/edit-acente/{id}', 'Admin\AcenteController@edit')->name('admin.acente.edit');
    Route::post('/edit-new-acente', 'Admin\AcenteController@editProcess')->name('admin.acente.edit.process');
});


/********************
 * Can Users
 ******************/
Route::group(['middleware' => 'role:' . get_roles() . ',can-add-user'], function() {
    Route::get('/new-user', 'Admin\AdminUserController@add')->name('admin_user_add');
    Route::post('/add-new-user', 'Admin\AdminUserController@addNewUser');
});

/********************
 * Can User Roles
 ******************/
Route::group(['middleware' => 'role:' . get_roles() . ',can-role'], function() {
    Route::get('/user-roles', 'Admin\AdminUserRolesController@index')->name('admin_user_roles');
});
Route::group(['middleware' => 'role:' . get_roles() . ',can-role-add'], function() {
    Route::get('/user-roles/add', 'Admin\AdminUserRolesController@addProcess')->name('admin.user_roles.add');
});

Route::group(['middleware' => 'role:' . get_roles() . ',can-edit-role'], function() {
    Route::get('/user-roles-edit/{id}', 'Admin\AdminUserRolesController@RolesPermissions')->name('admin_user_roles_edit');
    Route::get('/give-permission-role', 'Admin\AdminUserRolesController@givePermissionToRole')->middleware(['ajax']);
    Route::get('/take-permission-role', 'Admin\AdminUserRolesController@takePermissionFromRole')->middleware(['ajax']);
    Route::get('/give-permission-role-multiple', 'Admin\AdminUserRolesController@multipleGivePermission')->middleware(['ajax']);
    Route::get('/take-permission-role-multiple', 'Admin\AdminUserRolesController@multipleTakePermission')->middleware(['ajax']);
});
Route::get('/edit-tour-type/{id}', 'Admin\ToursController@edit_type')->name('admin.tour_type.edit');
Route::post('/edit-new-type', 'Admin\ToursController@editProcess_type')->name('admin.tour_type.edit.process');
Route::get('/delete-tours', 'Admin\ToursController@del')->middleware(['ajax']);
Route::get('/delete-acente', 'Admin\AcenteController@del')->middleware(['ajax']);
Route::get('/delete-tour-type', 'Admin\ToursController@delTourType')->middleware(['ajax']);
Route::group(['middleware' => 'role:admin|user|acente'], function() {

    Route::group(['middleware' => 'role:' . get_roles() . ''], function() {
        Route::get('/users', 'Admin\AdminUserController@index')->name('admin_users');
        Route::get('/get_all_users', 'Admin\AdminUserController@getAllUsers')->middleware(['ajax']);
        Route::get('/delete-user', 'Admin\AdminUserController@del')->middleware(['ajax']);
        Route::get('/delete-selected-user', 'Admin\AdminUserController@delUsers')->middleware(['ajax']);
        Route::get('/user-edit/{id}', 'Admin\AdminUserController@edit')->name('admin_user_edit');
        Route::post('/user-edit-proccess/', 'Admin\AdminUserController@editUserInfo')->name('user_edit_process');
        Route::get('/apply_user', 'Admin\AdminUserController@userApply')->middleware(['ajax']);
        Route::get('/check-user-email', 'Admin\AdminUserController@checkUserEmail')->middleware(['ajax']);
        Route::post('/add-new-user', 'Admin\AdminUserController@addNewUser');
        Route::get('/change-user-password/{id}', 'Admin\AdminUserController@changeUserPassword')->name('change_user_password');
        Route::post('/change-user-password-process', 'Admin\AdminUserController@changePasswordProcess')->name('change_user_password_process');
    });

    Route::post('/edit-content', 'Admin\AdminController@editContent')->name('admin.edit.content');
    Route::get('/profile', 'Admin\ProfileController@index')->name('admin.profile.index');
    Route::post('/edit-profile', 'Admin\ProfileController@edit')->name('admin.profile.edit');
    Route::get('/profile-acente', 'Admin\ProfileController@indexAcente')->name('admin.profile.acente');
    Route::post('/edit-profile-acente', 'Admin\ProfileController@editAcente')->name('admin.profile.acente.edit');
    Route::get('/change-password', 'Admin\ProfileController@changeUserPassword')->name('admin.profile.password');
    Route::post('/change-password-process', 'Admin\ProfileController@changePasswordProcess')->name('admin.profile.edit-password');

});
Auth::routes([
    'register' => false
]);
Route::get('/', '\App\Http\Controllers\Auth\LoginController@showLoginForm')->name('login')->middleware('guest');
Route::get('/get-town', 'Admin\CityController@getTownByCity');
Route::post('login', 'Auth\LoginController@login')->name('user.login');
Route::get('/logout', '\App\Http\Controllers\Auth\LoginController@logout')->name('logout');
Route::get('password/reset', 'Auth\ForgotPasswordController@showLinkRequestForm')->name('password.request');
Route::post('password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail')->name('password.email');
Route::get('password/reset/{token}', 'Auth\ResetPasswordController@showResetForm')->name('password.reset');
Route::post('password/reset', 'Auth\ResetPasswordController@reset')->name('password.update');

