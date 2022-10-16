@extends('admin.layouts.app')
@section('main')
    <div class="subheader py-2 py-lg-6 subheader-solid" id="kt_subheader">
        <div class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
            <!--begin::Info-->
            <div class="d-flex align-items-center flex-wrap mr-1">
                <!--begin::Page Heading-->
                <div class="d-flex align-items-baseline flex-wrap mr-5">
                    <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                        <li class="breadcrumb-item">
                            <a href="{{ Route('admin.profile.index') }}" class="text-muted">Kontrol Paneli</a>
                        </li>
                        <li class="breadcrumb-item">
                            <a href="#" class="text-muted">Acenteler</a>
                        </li>
                        <li class="breadcrumb-item">
                            <a href="#" class="text-muted">Yeni Acente Ekle</a>
                        </li>
                    </ul>
                    <!--end::Breadcrumb-->
                </div>
                <!--end::Page Heading-->
            </div>
            <!--end::Info-->
            <!--begin::Toolbar-->
            <div class="d-flex align-items-center">
                <!--begin::Actions-->
                <a href="#" class="btn btn-primary font-weight-bolder">Acenteler</a>

            </div>
            <!--end::Toolbar-->
        </div>
    </div>
    <div class="content  d-flex flex-column flex-column-fluid">
        <div class="d-flex flex-column-fluid">
            <div class="container">
                <div class="row justify-content-md-center">
                    <div class="col-lg-10">
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
                        <div class="card card-custom card-transparent">
                            <div class="card-body p-0">
                                <div class="card card-custom card-shadowless rounded-top-0">
                                    <!--begin::Body-->
                                    <div class="card-body p-0">
                                        <div class="row justify-content-center py-8 px-8 py-lg-15 px-lg-10">
                                            <div class="col-xl-12 col-xxl-10">
                                                <h3 class="font-weight-bold mb-10 text-dark">Acente Düzenleme Formu</h3>
                                                <div class="font-weight-nromal font-size-lg mb-6">
                                                    <p>Aşağıdaki formda acente üzerinde düzenleme yapabilirsiniz.</p>
                                                </div>
                                                <form class="form" action="{{ route('admin.acente.edit.process') }}" method="POST" autocomplete="off">
                                                    @csrf
                                                    <div class="form-group row">
                                                        <div class="col-lg-6">
                                                            <label>Acente Adı:</label>
                                                            <input type="text" class="form-control {{ $errors->has('acente_name') ? "is-invalid":"" }}" name="acente_name" value="{!! @$acente->acente_name !!}" placeholder="Acente adını giriniz..."/>
                                                        </div>
                                                        @if ($errors->has('acente_name'))
                                                            <div class="invalid-feedback">Bu alan zorunludur.</div>
                                                        @endif
                                                        <div class="col-lg-6">
                                                            <label>Yetkili İsim-Soyisim:</label>
                                                            <input type="text" class="form-control {{ $errors->has('competent_name') ? "is-invalid":"" }}" name="competent_name" value="{!! @$user->name !!}" placeholder="Yetkili isim-soyisim giriniz..."/>
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <div class="col-lg-6">
                                                            <label>Telefon No:</label>
                                                            <div class="input-group input-group-solid">
                                                                <span class="input-group-text">
                                                                    <i class="la la-phone"></i> +90
                                                                </span>
                                                                <input type="text" name="phone" class="form-control {{ $errors->has('phone') ? "is-invalid":"" }}" placeholder="Telefon No." value="{!! @$acente->phone !!}"/>
                                                            </div>
                                                            @if ($errors->has('phone'))
                                                                <div class="invalid-feedback">Bu alan zorunludur.</div>
                                                            @endif
                                                        </div>
                                                        <div class="col-lg-6">
                                                            <label>E-Posta:</label>
                                                            <input type="text" name="e_mail" class="form-control {{ $errors->has('e_mail') ? "is-invalid":"" }}" placeholder="E-mail giriniz..." value="{!! @$user->email !!}"/>
                                                            @if ($errors->has('e_mail'))
                                                                <div class="invalid-feedback">Bu alan zorunludur.</div>
                                                            @endif
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <div class="col-lg-6">
                                                            <label>Üyelik Bitiş Tarihi: <span class="text-danger">*</span></label>
                                                            <input type="text" name="uyelik_bitis_tarihi" class="form-control reminder-datepicker {{ $errors->has('uyelik_bitis_tarihi') ? "is-invalid":"" }}" id="reminder-datepicker" placeholder="Üyelik bitiş tarihi..." autcomplete="off" value="{!! @$acente->uyelik_bitis_tarihi !!}" readonly/>
                                                            @if ($errors->has('uyelik_bitis_tarihi'))
                                                                <div class="invalid-feedback">Bu alan zorunludur.</div>
                                                            @endif
                                                        </div>
                                                        <div class="col-lg-6">
                                                            <label>Türsab Numarası:</label>
                                                            <input type="text" name="tursab_no" class="form-control {{ $errors->has('tursab_no') ? "is-invalid":"" }}" placeholder="Geçerli bir türsab no giriniz..." value="{!! @$acente->tursab_no !!}"/>
                                                            @if ($errors->has('tursab_no'))
                                                                <div class="invalid-feedback">Bu alan zorunludur.</div>
                                                            @endif
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <div class="col-lg-12">
                                                            <input type="hidden" name="acente_id" value="{!! $acente->id !!}">
                                                            <button type="submit" class="btn btn-primary mr-2 float-right">Acente Düzenle
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <!--end::Body-->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--end::Card-->
            </div>
        </div>

    </div>
@endsection

