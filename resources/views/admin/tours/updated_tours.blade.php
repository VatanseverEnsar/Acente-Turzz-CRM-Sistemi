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
                        @if(Session::has('status'))
                            @if (session('status') == 2)
                                <div class="alert alert-custom alert-light-danger shadow-sm fade show mb-5" role="alert">
                                    <div class="alert-icon"><i class="flaticon2-checkmark"></i></div>
                                    <div class="alert-text">{{ session('msg') }}</div>
                                    <div class="alert-close">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true"><i class="ki ki-close"></i></span>
                                        </button>
                                    </div>
                                </div>
                            @endif
                        @endif
                        @csrf
                        <div class="card card-custom card-transparent">
                            <div class="card-body p-0">
                                <div class="card card-custom card-shadowless rounded-top-0">
                                    <!--begin::Body-->
                                    <div class="card-body p-0">
                                        <div class="row justify-content-center py-8 px-8 py-lg-15 px-lg-10">
                                            <div class="col-xl-12 col-xxl-10">
                                                <h3 class="font-weight-bold mb-10 text-dark">Güncellenen Turlar</h3>
                                                <div class="font-weight-nromal font-size-lg mb-6">
                                                    <p>Acente tarafından güncellenen tüm turları burada görüntüleyebilirsiniz.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row  px-lg-10">
                                            @if( $updated_tours->isNotEmpty() )
                                                @foreach( $updated_tours as $tours )
                                                <div class="col-lg-6">
                                                    <div class="card card-custom gutter-b bg-diagonal bg-diagonal-light-warning">
                                                        <div class="card-body">
                                                            <div class="d-flex align-items-center justify-content-between p-4 flex-lg-wrap flex-xl-nowrap">
                                                                <div class="d-flex flex-column mr-5">
                                                                    <a href="{{ url('edit-tour/'.$tours->tours_id) }}" class="h4 text-dark text-hover-primary mb-5">
                                                                        {{ $tours->updated_tours->tours_name }}
                                                                    </a>
                                                                    <p class="text-dark">
                                                                        {{ $tours->message }}
                                                                    </p>
                                                                </div>
                                                                <div class="ml-6 ml-lg-0 ml-xxl-6 flex-shrink-0">
                                                                    <a href="{{ url('edit-tour/'.$tours->tours_id) }}" target="_blank" data-id="{{ $tours->tours_id }}" class="btn font-weight-bolder text-uppercase btn-warning py-4 px-6">
                                                                        Turu Görüntüle
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                @endforeach
                                            @endif
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

