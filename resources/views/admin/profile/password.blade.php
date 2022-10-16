@extends('admin.layouts.app')
@section('main')
<div class="subheader py-2 py-lg-6 subheader-solid" id="kt_subheader">
    <div class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
        <button class="burger-icon burger-icon-left mr-4 d-inline-block d-lg-none" id="kt_subheader_mobile_toggle">
                <span></span>
        </button>
        <div class="d-flex align-items-center flex-wrap mr-2">
            <!--begin::Page Title-->
            <h5 class="text-dark font-weight-bold mt-2 mb-2 mr-5">Şifre Güncelle</h5>
            <div class="subheader-separator subheader-separator-ver mt-2 mb-2 mr-4 bg-gray-200"></div>
            <span class="text-muted font-weight-bold mr-4">#{{ @$user->id }}, {{ @$user->name }}</span>

            <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                <li class="breadcrumb-item">
                    <a href="{{ Route('admin.profile.password') }}" class="text-muted">Şifre Güncelle</a>
                </li>
            </ul>
        </div>
        <!--end::Info-->
        <!--begin::Toolbar-->
        <div class="d-flex align-items-center">
            <!--begin::Actions-->
            <a href="{{ Route('admin.profile.index') }}" class="btn btn-light-primary font-weight-bolder btn-sm mr-5">Profil Bilgilerim</a>
        </div>
        <!--end::Toolbar-->
    </div>
</div>

<div class="d-flex flex-column-fluid">
    <!--begin::Container-->
    <div class="container">
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
                @include('admin.profile.partials.user-side-menu')
            </div>
            <!--end::Aside-->
            <!--begin::Content-->
            <div class="flex-row-fluid ml-lg-8">

                <div class="card card-custom card-stretch">
                    <!--begin::Header-->
                    <div class="card-header py-3">
                        <div class="card-title align-items-start flex-column">
                            <h3 class="card-label font-weight-bolder text-dark">Şifre Değiştir</h3>
                            <span class="text-muted font-weight-bold font-size-sm mt-1"><span class="font-weight-boldest">{{ $user->name }}</span> hesabının şifresini güncelle</span>
                        </div>
                        <div class="card-toolbar">
                            <button type="submit" form="editPassword" class="btn btn-success mr-2 editUser">Şifre Güncelle</button>
                        </div>
                    </div>
                    <!--end::Header-->
                    <!--begin::Form-->
                    <form action="{{ Route('admin.profile.edit-password') }}" id="editPassword" method="POST" class="form" autocomplete="off">
                        @csrf
                        <div class="card-body">
                            <!--begin::Alert-->
                            <div class="alert alert-custom alert-light-danger fade show mb-10" role="alert">
                                <div class="alert-icon">
                                    <span class="svg-icon svg-icon-3x svg-icon-danger">
                                        <!--begin::Svg Icon | path:assets/media/svg/icons/Code/Info-circle.svg-->
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24"></rect>
                                        <circle fill="#000000" opacity="0.3" cx="12" cy="12" r="10"></circle>
                                        <rect fill="#000000" x="11" y="10" width="2" height="7" rx="1"></rect>
                                        <rect fill="#000000" x="11" y="7" width="2" height="2" rx="1"></rect>
                                        </g>
                                        </svg>
                                        <!--end::Svg Icon-->
                                    </span>
                                </div>
                                <div class="alert-text font-weight-bold">Lütfen şifrenizi kimse ile paylaşmayınız.</div>
                                <div class="alert-close">
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">
                                            <i class="ki ki-close"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-xl-3 col-lg-3 col-form-label text-alert">Yeni Şifre</label>
                                <div class="col-lg-9 col-xl-6">
                                    <input name="password" type="password" class="form-control form-control-lg form-control-solid" placeholder="Şifre giriniz" autocomplete="new-password"/>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-xl-3 col-lg-3 col-form-label text-alert">Şifre Tekrar</label>
                                <div class="col-lg-9 col-xl-6">
                                    <input id="password-confirm" name="password_confirmation" type="password" class="form-control form-control-lg form-control-solid" value="" placeholder="Şifreyi tekrar giriniz" />
                                </div>
                            </div>
                        </div>
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