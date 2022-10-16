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
                        @role(['admin'])
                        <a href="{{ Route('admin.ticket.add') }}" class="text-muted">Yeni Destek Talebi</a>
                        @else
                        <a href="{{ Route('admin.ticket.add') }}" class="text-muted">Yeni Destek Talebi</a>
                        @endrole
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
            <a href="{{ Route('admin.ticket.add') }}" class="btn btn-light-primary font-weight-bolder btn-sm">Yeni Talep Gönder</a>

        </div>
        <!--end::Toolbar-->
    </div>
</div>
<div class="d-flex flex-column-fluid">
    <div class="container">
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
        <div class="card card-custom gutter-b">
            <div class="card-header">
                <div class="card-title">
                    <h5 class="card-label">Yeni Destek Talebi Gönder</h5>
                </div>
            </div>
            <!--begin::Form-->
            <form action="{{ Route('admin.ticket.add-process') }}" method="POST" class="form">
                @csrf
                <div class="card-body">
                    <div class="row">
                        <div class="col-xl-3"></div>
                        <div class="col-xl-6">
                            <!--begin::Input-->
                            <div class="form-group">
                                <label>Başlık</label>
                                <input type="text" name="title" class="form-control form-control-solid form-control-lg" placeholder="Destek başlığını giriniz...">
                            </div>
                            <!--end::Input-->
                            <!--begin::Input-->
                            <div class="form-group">
                                <label>Konu</label>
                                <input type="text" name="subject" class="form-control form-control-solid form-control-lg" placeholder="Destek nedeni giriniz...">
                            </div>
                            <div class="form-group">
                                <label for="exampleTextarea">Mesajınız</label>
                                <textarea name="message" class="form-control form-control-solid form-control-lg" id="exampleTextarea" rows="3"></textarea>
                                <span class="form-text text-muted">Lütfen talebiniz ile ilgili detayları iletiniz.</span>
                            </div>
                            <!--end::Input-->
                        </div>
                        <div class="col-xl-3"></div>
                    </div>
                </div>
                <!--begin::Actions-->
                <div class="card-footer">
                    <div class="row">
                        <div class="col-xl-3"></div>
                        <div class="col-xl-6">
                            <button type="submit" class="btn btn-primary font-weight-bold mr-2">Yeni Destek Talebi Gönder</button>
                        </div>
                        <div class="col-xl-3"></div>
                    </div>
                </div>
                <!--end::Actions-->
            </form>
            <!--end::Form-->
        </div>
    </div>
    <!--end::Container-->
</div>
@endsection