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
                    <a href="{{ Route('dashboard') }}" class="text-muted">Kontrol Paneli</a>
                </li>
                <li class="breadcrumb-item">
                    <a href="{{ Route('admin_users') }}" class="text-muted">Kullanıcılar</a>
                </li>
                <li class="breadcrumb-item">
                    <a href="{{ Route('admin_user_edit_billing',['id'=>$user->id]) }}" class="text-muted">Kullanıcı Fatura Bilgileri</a>
                </li>
            </ul>
        </div>
        <!--end::Info-->
        <!--begin::Toolbar-->
        <div class="d-flex align-items-center">
            <!--begin::Actions-->
            <a href="{{ Route('admin_users') }}" class="btn btn-light-primary font-weight-bolder btn-sm mr-5">Kullanıcılar</a>
            <a href="{{ Route('admin_user_add') }}" class="btn btn-light-primary font-weight-bolder btn-sm">Kullanıcı Ekle</a>
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
                <!--begin::Profile Card-->
                <div class="card card-custom card-stretch">
                    <!--begin::Body-->
                    <div class="card-body pt-10">

                        <div class="d-flex align-items-center">
                            <div class="symbol symbol-60 symbol-xxl-100 mr-5 align-self-start align-self-xxl-center symbol-light-danger">
                                <span class="symbol-label font-size-h1">{{ substr($user->name,0,1) }}</span>
                                <i class="symbol-badge bg-success"></i>
                            </div>
                            <div>
                                <a href="#" class="font-weight-bolder font-size-h5 text-dark-75 text-hover-primary">{{ $user->name }}</a>
                                @php
                                $user_role = \App\Models\User::getUserRole($user->id);
                                @endphp
                                @if( $user_role == 1 )
                                <div class="text-danger">Yönetici</div>
                                @endif
                                @if( $user_role == 2 )
                                <div class="text-muted">Kullanıcı</div>
                                @endif
                                @if( $user_role == 3 )
                                <div class="text-warning">Yardımcı Yönetici</div>
                                @endif
                                @if( $user_role == 4 )
                                <div class="text-info">Editör</div>
                                @endif
                                <div class="mt-2">
                                    <a href="#" class="btn btn-sm btn-primary font-weight-bold mr-2 py-2 px-3 px-xxl-5 my-1">SMS</a>
                                    <a href="mailto:{{ $user->email }}" class="btn btn-sm btn-success font-weight-bold py-2 px-3 px-xxl-5 my-1">E-posta</a>
                                </div>
                            </div>
                        </div>
                        <!--end::User-->
                        <!--begin::Contact-->
                        <div class="py-9">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <span class="font-weight-bold mr-2">E-posta:</span>
                                <a href="#" class="text-muted text-hover-primary">{{ $user->email }}</a>
                            </div>
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <span class="font-weight-bold mr-2">Phone:</span>
                                @if( $user_meta->phone != NULL )
                                <span class="text-muted">{{ @$user_meta->phone_code.''.@$user_meta->phone }}</span>
                                @else
                                <span class="text-muted">Belirtilmemiş</span>
                                @endif
                            </div>
                            <div class="d-flex align-items-center justify-content-between">
                                <span class="font-weight-bold mr-2">Ülke:</span>
                                @if( $user_meta->country != NULL )
                                <span class="text-muted">{{ \App\Models\User::getCountryName($user_meta->country) }}</span>
                                @else

                                @endif
                            </div>
                        </div>
                        <!--end::Contact-->
                        <!--begin::Nav-->
                        @include('admin.users.partials.profile-menu')
                        <!--end::Nav-->
                    </div>
                    <!--end::Body-->
                </div>
                <!--end::Profile Card-->
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
                    <form action="{{ Route('user_edit_billing_process') }}" id="editProfile" method="POST" class="form" autocomplete="off">
                        @csrf
                        <div class="card-body">
                            <div class="row">
                                <div class="col-xl-6">
                                    <!--begin::Group-->
                                    <div class="form-group">
                                        <label>Firma Adı</label>
                                        <input type="text" class="form-control form-control-solid form-control-lg" name="billing[company_name]" placeholder="Şirket Adı" value="{{ @$billing_data['company_name'] }}"/>
                                        <span class="form-text text-muted">Lütfen firmanın tüzel adınızı giriniz.</span>
                                    </div>
                                </div>
                                <!--end::Group-->
                                <!--begin::Group-->
                                <div class="col-xl-6">
                                    <div class="form-group">
                                        <label>Firma Telefonu</label>
                                        <input type="text" class="form-control form-control-solid form-control-lg" name="billing[phone]" placeholder="Firma telefon no." value="{{ @$billing_data['phone'] }}"/>
                                        <span class="form-text text-muted">Lütfen firmanın şirket numarasını giriniz. (Ör: 08504340666)</span>
                                    </div>
                                </div>
                                <!--end::Group-->
                            </div>
                            <!--end::Row-->
                            <!--begin::Row-->
                            <div class="row">
                                <div class="col-xl-6">
                                    <!--begin::Group-->
                                    <div class="form-group">
                                        <label>Şehir</label>
                                        <input type="text" class="form-control form-control-solid form-control-lg" name="billing[city]" placeholder="Firma Şehri" value="{{ @$billing_data['city'] }}"/>
                                        <span class="form-text text-muted">Firmanın vergiye kayıtlı şehir bilgisini belirtiniz.</span>
                                    </div>
                                    <!--end::Group-->
                                </div>
                                <div class="col-xl-6">
                                    <!--begin::Group-->
                                    <div class="form-group">
                                        <label>Firma Ülke</label>
                                        <select name="billing[country]" class="form-control form-control-solid form-control-lg">
                                            @foreach( \App\Models\Countries::all() as $country )
                                            <option value="{{ $country->country_id }}" {{ @$billing_data['country'] == $country->country_id ? "selected":"" }}>{{ $country->country_name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <!--end::Group-->
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-xl-6">
                                    <!--begin::Group-->
                                    <div class="form-group">
                                        <label>Posta Kodu</label>
                                        <input type="text" class="form-control form-control-solid form-control-lg" name="billing[zip_code]" placeholder="Firma posta kodu" value="{{ @$billing_data['zip_code'] }}"/>
                                    </div>
                                </div>
                                <!--end::Group-->
                                <!--begin::Group-->
                                <div class="col-xl-6">
                                    <div class="form-group">
                                        <label>Firma Adresi</label>
                                        <input type="text" class="form-control form-control-solid form-control-lg" name="billing[address]" placeholder="Firma adres bilgisi" value="{{ @$billing_data['address'] }}"/>
                                    </div>
                                </div>
                                <!--end::Group-->
                            </div>

                            <div class="row">
                                <div class="col-xl-6">
                                    <!--begin::Group-->
                                    <div class="form-group">
                                        <label>Vergi Dairesi</label>
                                        <input type="text" class="form-control form-control-solid form-control-lg" name="billing[tax]" placeholder="Firma vergi dairesi" value="{{ @$billing_data['tax'] }}" />
                                    </div>
                                </div>
                                <!--end::Group-->
                                <!--begin::Group-->
                                <div class="col-xl-6">
                                    <div class="form-group">
                                        <label>Vergi Numarası</label>
                                        <input type="text" class="form-control form-control-solid form-control-lg" name="billing[tax_no]" placeholder="Firma vergi dairesi" value="{{ @$billing_data['tax_no'] }}"/>
                                    </div>
                                </div>
                                <!--end::Group-->
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

