@extends('admin.layouts.app')
@section('main')
    <div class="subheader py-2 py-lg-6 subheader-solid {{ $agent->isMobile() || $agent->isTablet() ? 'customer-subheader':'' }}" id="kt_subheader">
        <div class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
            <!--begin::Info-->
            <div class="d-flex align-items-center flex-wrap mr-1">
                <!--begin::Page Heading-->
                <div class="d-flex align-items-baseline flex-wrap mr-5">
                    <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                        <li class="breadcrumb-item">
                            <a href="#" class="text-muted">Kontrol Paneli</a>
                        </li>
                        <li class="breadcrumb-item">
                            <a href="javascript:void(0);" class="text-muted">Raporlar</a>
                        </li>
                        @if( $type == "call" )
                            <li class="breadcrumb-item">
                                <a href="{!! Route('admin.reports.call') !!}" class="text-muted">Arama Raporları</a>
                            </li>
                        @endif
                        @if( $type == "appointments" )
                            <li class="breadcrumb-item">
                                <a href="{!! Route('admin.reports.appointment') !!}" class="text-muted">Randevu Raporları</a>
                            </li>
                        @endif
                        @if( $type == "customer" )
                            <li class="breadcrumb-item">
                                <a href="{!! Route('admin.reports.customer') !!}" class="text-muted">Müşteri Raporları</a>
                            </li>
                        @endif
                        @if( $type == "bid" )
                            <li class="breadcrumb-item">
                                <a href="{!! Route('admin.reports.bid') !!}" class="text-muted">Teklif Raporları</a>
                            </li>
                        @endif
                        @if( $type == "contract" )
                            <li class="breadcrumb-item">
                                <a href="{!! Route('admin.reports.contract') !!}" class="text-muted">Teklif Raporları</a>
                            </li>
                        @endif
                    </ul>
                    <!--end::Breadcrumb-->
                </div>
                <!--end::Page Heading-->
            </div>
        </div>
    </div>
    <div class="d-flex flex-column-fluid">
        <div class="container">
            @if( $type == "call" )
                @include('admin.reports.calls')
            @endif
            @if( $type == "appointments" )
                @include('admin.reports.appointments')
            @endif
            @if( $type == "customer" )
                @include('admin.reports.customer')
            @endif
            @if( $type == "bid" )
                @include('admin.reports.bid')
            @endif
            @if( $type == "contract" )
                @include('admin.reports.contract')
            @endif
        </div>
    </div>
@endsection
