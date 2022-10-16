@extends('admin.layouts.app')
@section('main')
    <div class="subheader py-2 py-lg-6 subheader-solid" id="kt_subheader">
        <div class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
            <button class="burger-icon burger-icon-left mr-4 d-inline-block d-lg-none" id="kt_subheader_mobile_toggle">
                <span></span>
            </button>
            <div class="d-flex align-items-center flex-wrap mr-2">
                <!--begin::Page Title-->
                <h5 class="text-dark font-weight-bold mt-2 mb-2 mr-5">Acente Bilgileri</h5>
                <div class="subheader-separator subheader-separator-ver mt-2 mb-2 mr-4 bg-gray-200"></div>
                <span class="text-muted font-weight-bold mr-4">#{{ @$user->id }}, {{ @$user->name }}</span>

                <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                    <li class="breadcrumb-item">
                        <a href="{{ Route('admin.profile.index') }}" class="text-muted">Acente Bilgileri </a>
                    </li>
                </ul>
            </div>
            @if( App\Models\User::getRoleId()->role_id==3 )
                <span class="text-dark font-weight-bold"> Üyeliğinizin Bitmesine Son <strong style="color:red">{{ @$length }}</strong> Gün</span>
            @endif
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
                                <h3 class="card-label font-weight-bolder text-dark">Acente Bilgileri</h3>
                                <span class="text-muted font-weight-bold font-size-sm mt-1"><span class="font-weight-boldest">Acente bilgilerinizi bu ekrandan düzenleyebilirsiniz.</span>
                            </div>
                            <div class="card-toolbar">
                                <button type="submit" form="editProfileAcente" class="btn btn-success mr-2 editUser">Değişiklikleri Kaydet</button>
                            </div>
                        </div>
                        <!--end::Header-->
                        <!--begin::Form-->
                        <form action="{{ Route('admin.profile.acente.edit') }}" id="editProfileAcente" method="POST" class="form" autocomplete="off">
                            @csrf
                            <div class="card-body">
                                <div class="form-group row">
                                    <label class="col-xl-3 col-lg-3 col-form-label">Acente Adı</label>
                                    <div class="col-lg-9 col-xl-6">
                                        <input class="form-control form-control-lg form-control-solid" name="acente_name" type="text" value="{{ @$acente->acente_name }}" autocomplete="off"/>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-xl-3 col-lg-3 col-form-label">Türsab No</label>
                                    <div class="col-lg-9 col-xl-6">
                                        <input class="form-control form-control-lg form-control-solid" name="tursab_no" type="text" value="{{ @$acente->tursab_no }}" autocomplete="off" />
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

