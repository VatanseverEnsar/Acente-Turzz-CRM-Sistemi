<?php
$billing_data = unserialize($user_meta['billing_address']);
?>
@extends('admin.layouts.app')
@section('main')
<div class="subheader py-2 py-lg-6 subheader-solid" id="kt_subheader">
    <div class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
        <button class="burger-icon burger-icon-left mr-4 d-inline-block d-lg-none" id="kt_subheader_mobile_toggle">
                <span></span>
        </button>
        <div class="d-flex align-items-center flex-wrap mr-2">
            <!--begin::Page Title-->
            <h5 class="text-dark font-weight-bold mt-2 mb-2 mr-5">Kullanıcı Düzenle</h5>
            <div class="subheader-separator subheader-separator-ver mt-2 mb-2 mr-4 bg-gray-200"></div>
            <span class="text-muted font-weight-bold mr-4">#{{ @$user->id }}, {{ @$user->name }}</span>

            <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                <li class="breadcrumb-item">
                    <a href="{{ Route('admin_users') }}" class="text-muted">Kullanıcılar</a>
                </li>
                <li class="breadcrumb-item">
                    <a href="{{ Route('admin_user_edit',['id'=>$user->id]) }}" class="text-muted">Kullanıcı Düzenle</a>
                </li>
            </ul>
        </div>
        <!--end::Info-->
        <!--begin::Toolbar-->
        <div class="d-flex align-items-center">
            <!--begin::Actions-->
            <a href="{{ Route('admin_users') }}" class="btn btn-primary font-weight-bolder mr-5">Kullanıcılar</a>
            <a href="{{ Route('admin_user_add') }}" class="btn btn-primary font-weight-bolder">Kullanıcı Ekle</a>
        </div>
        <!--end::Toolbar-->
    </div>
</div>

<div class="d-flex flex-column-fluid">
    <!--begin::Container-->
    <div class="container">
        @if( $user->email_verified_at == NULL )
        <div class="alert alert-custom alert-notice alert-light-warning shadow-sm fade show mb-5" role="alert">
            <div class="alert-icon">
                <i class="flaticon-warning"></i>
            </div>
            <div class="alert-text">Kullanıcı hesabı henüz onaylanmamıştır! Manuel olarak onaylamak istiyorsanız, lütfen <span class="font-weight-bold text-danger">Hesabı Onayla</span> butonuna tıklayınız.</div>
            <div class="alert-close">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">
                        <i class="ki ki-close"></i>
                    </span>
                </button>
            </div>
        </div>
        @endif
        @if(Session::has('status'))
        @if (session('status') == 1)
        <div class="alert alert-custom alert-light-success shadow-sm fade show mb-5" role="alert">
            <div class="alert-icon"><i class="flaticon2-checkmark"></i></div>
            <div class="alert-text">{{ session('msg') }}</div>
            <div class="alert-close">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true"><i class="ki ki-close"></i></span>
                </button>
            </div>
        </div>
        @endif
        @if (session('status') == 0)
        <div class="alert alert-custom alert-light-danger shadow fade show mb-5" role="alert">
            <div class="alert-icon"><i class="flaticon2-warning"></i></div>
            <div class="alert-text">{{ session('msg') }}</div>
            <div class="alert-close">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true"><i class="ki ki-close"></i></span>
                </button>
            </div>
        </div>
        @endif
        @endif
        @if ($errors->any())
        @foreach ($errors->all() as $error)
        <div class="alert alert-custom alert-light-danger shadow fade show mb-5" role="alert">
            <div class="alert-icon"><i class="flaticon2-warning"></i></div>
            <div class="alert-text">{{ $error }}</div>
            <div class="alert-close">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true"><i class="ki ki-close"></i></span>
                </button>
            </div>
        </div>
        @endforeach
        @endif
        <div class="d-flex flex-row">
            <!--begin::Aside-->
            <div class="flex-row-auto offcanvas-mobile w-250px w-xxl-350px" id="kt_profile_aside">
                @include('admin.users.partials.user-side-menu')
            </div>
            <!--end::Aside-->
            <!--begin::Content-->
            <div class="flex-row-fluid ml-lg-8">

                <div class="card card-custom card-stretch">
                    <!--begin::Header-->
                    <div class="card-header py-3">
                        <div class="card-title align-items-start flex-column">
                            <h3 class="card-label font-weight-bolder text-dark">Profil Bilgileri</h3>
                            <span class="text-muted font-weight-bold font-size-sm mt-1"><span class="font-weight-boldest">{{ $user->name }}</span> kullanıcısının hesap bilgilerini düzenleyebilirsiniz</span>
                        </div>
                        <div class="card-toolbar">
                            @if( $user->email_verified_at == NULL )
                            <button type="button" class="btn btn-warning mr-2 applyUser" data-id="{{ $user->id }}">Hesabı Onayla</button>
                            @endif
                            <button type="submit" form="editProfile" class="btn btn-success mr-2 editUser">Değişiklikleri Kaydet</button>
                            <button type="button" class="btn btn-secondary">İptal Et</button>
                        </div>
                    </div>
                    <!--end::Header-->
                    <!--begin::Form-->
                    <form action="{{ Route('user_edit_process') }}" id="editProfile" method="POST" class="form" autocomplete="off">
                        @csrf
                        <div class="card-body">
                            <div class="form-group row">
                                <label class="col-xl-3 col-lg-3 col-form-label">Kullanıcı Adı</label>
                                <div class="col-lg-9 col-xl-6">
                                    <input class="form-control form-control-lg form-control-solid" name="name" type="text" value="{{ $user->name }}" autocomplete="off" />
                                    <span class="form-text text-muted">Kullanıcı adı olarak isim ve soyisim tanımlıyabilirsiniz. Bu alan kullanıcının profil alanında gözükecektir.</span>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-xl-3 col-lg-3 col-form-label">İsim</label>
                                <div class="col-lg-9 col-xl-6">
                                    <input class="form-control form-control-lg form-control-solid" name="first_name" type="text" value="{{ @$user_meta->first_name }}" autocomplete="off" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-xl-3 col-lg-3 col-form-label">Soyisim</label>
                                <div class="col-lg-9 col-xl-6">
                                    <input class="form-control form-control-lg form-control-solid" name="last_name" type="text" value="{{ @$user_meta->last_name }}" autocomplete="off" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-xl-3 col-lg-3 col-form-label">E-Posta Adresi</label>
                                <div class="col-lg-9 col-xl-6">
                                    <div class="input-group input-group-lg input-group-solid">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">
                                                <i class="la la-at"></i>
                                            </span>
                                        </div>
                                        <input type="email" class="form-control form-control-lg form-control-solid" value="{{ $user->email }}" readonly />
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-xl-3 col-lg-3 col-form-label">Ünvan</label>
                                <div class="col-lg-9 col-xl-6">
                                    <input class="form-control form-control-lg form-control-solid" name="unvan" type="text" value="{{ @$user_meta->unvan }}" autocomplete="off" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-xl-3 col-lg-3 col-form-label">GSM No.</label>
                                <div class="col-lg-9 col-xl-6">
                                    <div class="input-group input-group-solid input-group-lg">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">
                                                <i class="la la-phone"></i>
                                            </span>
                                        </div>
                                        <input type="text" class="form-control form-control-solid form-control-lg" name="phone"  placeholder="Gsm numarası giriniz" autocomplete="off" value="{{ @$user_meta->phone }}"/>
                                    </div>
                                    <span class="form-text text-muted">Lütfen geçerli bir gsm numarası giriniz.(ör:: 5302451****).</span>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-xl-3 col-lg-3 col-form-label">Sabit Telefon No.</label>
                                <div class="col-lg-9 col-xl-6">
                                    <div class="input-group input-group-solid input-group-lg">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">
                                                <i class="la la-phone"></i>
                                            </span>
                                        </div>
                                        <input type="text" class="form-control form-control-solid form-control-lg" name="phone_2"  placeholder="Sabit telefon giriniz." autocomplete="off" value="{{ @$user_meta->phone_2 }}"/>
                                    </div>
                                    <span class="form-text text-muted">Lütfen geçerli bir sabit numara giriniz.(ör:: 8504340***).</span>
                                </div>
                            </div>
                            <div class="form-group row fv-plugins-icon-container has-success">
                                <label class="col-form-label col-xl-3 col-lg-3">Kullanıcı Rolü</label>
                                <div class="col-xl-9 col-lg-9 col-form-label">
                                    <div class="checkbox-inline">
                                        @foreach( \App\Models\Roles::all() as $role )
                                            <label class="checkbox">
                                                <input name="account_role" type="radio"  value="{!! $role->id !!}" {!! $role->id == $user->role->role_id ? "checked":"" !!}/>
                                                <span></span>{!! $role->name !!}</label>
                                        @endforeach

                                    </div>
                                </div>
                            </div>
                        </div>
                        <input type="hidden" name="user_id" value="{{ $user->id }}" />
                    </form>
                    <!--end::Form-->
                </div>
            </div>
            <!--end::Content-->
        </div>
        <!--end::Profile Personal Information-->
    </div>
    <!--end::Container-->
</div>
<!--end::Entry-->
@endsection

