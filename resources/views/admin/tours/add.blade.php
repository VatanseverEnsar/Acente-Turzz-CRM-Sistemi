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
                            <a href="{{ Route('admin.tour.index') }}" class="text-muted">Turlar</a>
                        </li>
                        <li class="breadcrumb-item">
                            <a href="{{ Route('admin.tour.add') }}" class="text-muted">Yeni Tur Ekle</a>
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
                <a href="{{ Route('admin.tour.index') }}" class="btn btn-primary font-weight-bolder">Turlar</a>

            </div>
            <!--end::Toolbar-->
        </div>
    </div>
    <div class="content  d-flex flex-column flex-column-fluid">
        <div class="d-flex flex-column-fluid">
            <div class="container">
                <div class="row justify-content-md-center">
                    <div class="col-lg-10">
                        @if (session('status') == 2)
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
                                                <h3 class="font-weight-bold mb-10 text-dark">Yeni Tur Ekleme Formu</h3>
                                                <div class="font-weight-nromal font-size-lg mb-6">
                                                    <p>Aşağıdaki formu doldurarak yeni tur ekleyebilirsiniz .</p>
                                                </div>
                                                <form class="form" action="{{ route('admin.tour.add.process') }}" method="POST" autocomplete="off" id="kt_form_1">
                                                    @csrf

                                                    <div class="form-group row">
                                                        <div class="col-lg-{{ \App\Models\User::getRoleId()->role_id == 1  ? "4":"6" }}">
                                                            <label>Tur Adı:</label>
                                                            <input type="text" id="name" class="form-control {{ $errors->has('tours_name') ? "is-invalid":"" }}" name="tours_name" value="{{ old('tours_name') }}" placeholder="Tur adını giriniz..."/>
                                                        </div>
                                                        @if ($errors->has('tours_name'))
                                                            <div class="invalid-feedback">Bu alan zorunludur.</div>
                                                        @endif
                                                        <div class="col-lg-{{ \App\Models\User::getRoleId()->role_id == 1  ? "4":"6" }}">
                                                            <label for="type">Tur Türü</label>
                                                            <select name="tour_type" class="form-control" id="type" >
                                                                <option>--Tur'un Türünü Seçiniz--</option>
                                                                @foreach( $tour_type as $type )
                                                                    <option value="{!! $type->id !!}">{!! $type->tour_type !!}</option>
                                                                @endforeach
                                                            </select>
                                                        </div>
                                                        @if( \App\Models\User::getRoleId()->role_id == 1 )
                                                        <div class="col-lg-4">
                                                            <label for="acente">Acente</label>
                                                            <select name="acente" id="acente" class="form-control">
                                                                <option>--Acente Seçiniz--</option>
                                                                @foreach( $acenteler as $acente )
                                                                    <option value="{!! $acente->id !!}">{!! $acente->acente_name !!}</option>
                                                                @endforeach
                                                            </select>
                                                        </div>
                                                        @endif
                                                    </div>
                                                    <div class="form-group row">
                                                        <div class="col-lg-12">
                                                            <div class="card card-custom"  style="background-color: #f5f5f5e0">
                                                                <div class="card-header">
                                                                    <h3 class="card-title">
                                                                        Tarih ve Fiyat Bilgileri
                                                                    </h3>
                                                                </div>
                                                                <div class="card-body">
                                                                    <div id="kt_repeater_2">
                                                                        <div data-repeater-list="dates">
                                                                            <div data-repeater-item >
                                                                                <div class="form-group row">
                                                                                    <label class="col-form-label col-lg-2 ">Tarih Aralığı:</label>
                                                                                    <div class="col-lg-4">
                                                                                        <div class='input-group'>
                                                                                            <input type='text' name="date_range" class="form-control datepicker_tour" data-kt-repeater="daterangepicker" readonly  placeholder="Tarih Aralığı Seçiniz"/>
                                                                                            <div class="input-group-append">
                                                                                                <span class="input-group-text"><i class="la la-calendar-check-o"></i></span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <label class="col-form-label col-lg-1">Fiyat</label>
                                                                                    <div class="col-lg-3">
                                                                                        <div class="input-group">
                                                                                            <div class="input-group-prepend">
                                                                                                <span class="input-group-text">TL</span>
                                                                                            </div>
                                                                                            <input type="text" name="price" class="form-control" placeholder="0.00"/>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-lg-2">
                                                                                        <a href="javascript:" data-repeater-delete="" class="btn btn-sm font-weight-bolder btn-light-danger">
                                                                                            <i class="la la-trash-o"></i>Sil
                                                                                        </a>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>

                                                                        <div class="form-group row">
                                                                            <div class="col-lg-12">
                                                                                <a href="javascript:;" data-repeater-create="" class="btn btn-sm font-weight-bolder btn-light-primary">
                                                                                    <i class="la la-plus"></i>Tarih ve Fiyat Ekle
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div class="form-group row">
                                                        <div class="col-lg-12">
                                                            <div id="kt_repeater_1">
                                                                <div class="form-group row" >
                                                                    <div data-repeater-list="contents">
                                                                        <div data-repeater-item class="form-group align-items-center" >
                                                                            <div class="col-lg-12">
                                                                                <label class="col-form-label text-right" name="icerik">Tur Programı:</label>
                                                                                <textarea rows="5" class="form-control ckeditors m--padding-30" name="content"></textarea>
                                                                            </div>
                                                                            <div class="col-lg-12" style="margin-top: 3%">
                                                                                <a href="javascript:" data-repeater-delete="" class="btn btn-sm font-weight-bolder btn-light-danger">
                                                                                    <i class="la la-trash-o"></i>Sil
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-lg-12">
                                                                        <a href="javascript:;" data-repeater-create="" class="btn btn-sm font-weight-bolder btn-light-primary">
                                                                            <i class="la la-plus"></i>Gün Ekle
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <div class="col-lg-12">
                                                            <button type="submit" class="btn btn-primary mr-2 float-right">Tur Ekle
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

