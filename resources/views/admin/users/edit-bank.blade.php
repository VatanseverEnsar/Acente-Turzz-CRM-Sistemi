@extends('admin.layouts.app')
@section('main')
<div class="subheader py-2 py-lg-6 subheader-solid" id="kt_subheader">
    <div class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
        <button class="burger-icon burger-icon-left mr-4 d-inline-block d-lg-none" id="kt_subheader_mobile_toggle">
                <span></span>
        </button>
        <div class="d-flex align-items-center flex-wrap mr-2">
            <!--begin::Page Title-->
            <h5 class="text-dark font-weight-bold mt-2 mb-2 mr-5">Banka Hesabı Düzenle</h5>
            <div class="subheader-separator subheader-separator-ver mt-2 mb-2 mr-4 bg-gray-200"></div>
            <span class="text-muted font-weight-bold mr-4">#{{ @$bank->bank_id }}, {{ @$bank->bank_account_name }} - {{ $bank->bank_name }}</span>

            <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                <li class="breadcrumb-item">
                    <a href="{{ Route('admin_users') }}" class="text-muted">Kullanıcılar</a>
                </li>
                <li class="breadcrumb-item">
                    <a href="{{ Route('admin_user_edit_banks',['user_id'=>$user->id,'id'=>$bank->bank_id]) }}" class="text-muted">Banka Hesabı Düzenle</a>
                </li>
            </ul>
        </div>
        <!--end::Info-->
        <!--begin::Toolbar-->
        <div class="d-flex align-items-center">
            <!--begin::Actions-->
            <a href="{{ Route('admin_user_add_banks',['id'=>$user->id]) }}" class="btn btn-light-primary font-weight-bolder btn-sm mr-5">Yeni Banka Hesabı Ekle</a>
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
                            <h3 class="card-label font-weight-bolder text-dark">#{{ $bank->bank_id }}, {{ $bank->bank_account_name }} - {{ $bank->bank_name }} Düzenle</h3>
                            <span class="text-muted font-weight-bold font-size-sm mt-1"><span class="font-weight-boldest">{{ $user->name }}</span> kullanıcısı için varolan banka hesabını düzenleyebilirsiniz.</span>
                        </div>
                        <div class="card-toolbar">
                            @if( $user->email_verified_at == NULL )
                            <button type="button" class="btn btn-warning mr-2 applyUser" data-id="{{ $user->id }}">Hesabı Onayla</button>
                            @endif
                            <button type="submit" form="addNewBank" class="btn btn-success mr-2 editUser">Hesabı Kaydet</button>
                        </div>
                    </div>
                    <!--end::Header-->
                    <!--begin::Form-->
                    <form action="{{ Route('admin_user_edit_banks_process') }}" id="addNewBank" method="POST" class="form" autocomplete="off">
                        @csrf
                        <div class="card-body">
                            <div class="row">
                                <div class="col-xl-6">
                                    <!--begin::Group-->
                                    <div class="form-group">
                                        <label>Banka Hesap Adı</label>
                                        <input type="text" class="form-control form-control-solid form-control-lg" name="bank_account_name" placeholder="Banka Hesap Adı" value="{{ $bank->bank_account_name }}"/>
                                        <span class="form-text text-muted">Banka hesabının ad soyad bölümünü giriniz.</span>
                                    </div>
                                </div>
                                <!--end::Group-->
                                <!--begin::Group-->
                                <div class="col-xl-6">
                                    <div class="form-group">
                                        <label>Banka Adı</label>
                                        <input type="text" class="form-control form-control-solid form-control-lg" name="bank_name" placeholder="Banka Adı" value="{{ $bank->bank_name }}"/>
                                        <span class="form-text text-muted">Banka adını giriniz. (Ör: Garanti Bankası)</span>
                                    </div>
                                </div>
                                <!--end::Group-->
                            </div>
                            <!--end::Row-->
                            <!--begin::Row-->
                            <div class="row">
                                <div class="col-xl-12">
                                    <!--begin::Group-->
                                    <div class="form-group">
                                        <label>IBAN Numarası</label>
                                        <input type="text" class="form-control form-control-solid form-control-lg" name="iban" placeholder="IBAN Numarası" value="{{ $bank->iban }}"/>
                                        <span class="form-text text-muted">Hesaba ait iban numarasını giriniz. (Ör: TR51 7041 *** *** **** **)</span>
                                    </div>
                                    <!--end::Group-->
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-xl-6">
                                    <!--begin::Group-->
                                    <div class="form-group">
                                        <label>Şube Kodu</label>
                                        <input type="text" class="form-control form-control-solid form-control-lg" name="bank_code" placeholder="Hesap Şube Kodu" value="{{ $bank->bank_code }}"/>
                                        <span class="form-text text-muted">Bu alan zorunlu değildir.</span>
                                    </div>
                                </div>
                                <!--end::Group-->
                                <!--begin::Group-->
                                <div class="col-xl-6">
                                    <div class="form-group">
                                        <label>Hesap No.</label>
                                        <input type="text" class="form-control form-control-solid form-control-lg" name="account_number" placeholder="Hesap Numarası" value="{{ $bank->account_number }}"/>
                                        <span class="form-text text-muted">Bu alan zorunlu değildir.</span>
                                    </div>
                                </div>
                                <!--end::Group-->
                            </div>
                        </div>
                        <input type="hidden" name="user_id" value="{{ $user->id }}" />
                        <input type="hidden" name="bank_id" value="{{ $bank->bank_id }}" />
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