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
                        <a href="{{ Route('admin.ticket.index') }}" class="text-muted">Destek Talepleri</a>
                        @else
                        <a href="{{ Route('admin.ticket.index') }}" class="text-muted">Destek Taleplerim</a>
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
    <!--begin::Container-->
    <div class="container">
        <!--begin::Card-->
        <div class="card card-custom gutter-b">
            <div class="card-body">
                @role(['admin'])
                    @if( $agent->isMobile() )
                        <div class="datatable datatable-bordered datatable-head-custom" id="ticket_datatable_1"></div>
                    @else
                        <div class="datatable datatable-bordered datatable-head-custom" id="ticket_datatable"></div>
                    @endif
                @else
                    @if( $agent->isMobile() )
                        <div class="datatable datatable-bordered datatable-head-custom" id="ticket_datatable_3"></div>
                    @else
                        <div class="datatable datatable-bordered datatable-head-custom" id="ticket_datatable_2"></div>
                    @endif
                
                @endrole
            </div>
        </div>
    </div>
    <!--end::Container-->
</div>
@endsection