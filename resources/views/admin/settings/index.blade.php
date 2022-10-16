@extends('admin.layouts.app')

@section('main')
<div class="m-grid__item m-grid__item--fluid m-wrapper">
    <!-- BEGIN: Subheader -->
    <div class="m-subheader ">
        <div class="d-flex align-items-center">
            <div class="mr-auto">
                <h3 class="m-subheader__title m-subheader__title--separator">{{ __('backend.general_settings') }}</h3>
                <ul class="m-subheader__breadcrumbs m-nav m-nav--inline">
                    <li class="m-nav__item m-nav__item--home">
                        <a href="{{ Route('settings') }}" class="m-nav__link m-nav__link--icon">
                            <i class="m-nav__link-icon la la-home"></i>
                        </a>
                    </li>
                    <li class="m-nav__separator">
                        -
                    </li>
                    <li class="m-nav__item">
                        <a href="{{ Route('dashboard') }}" class="m-nav__link">
                            <span class="m-nav__link-text">Kontrol Paneli</span>
                        </a>
                    </li>
                    <li class="m-nav__separator">
                        -
                    </li>
                    <li class="m-nav__item">
                        <a href="{{ Route('settings') }}" class="m-nav__link">
                            <span class="m-nav__link-text">
                                {{ __('backend.general_settings') }}
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="m-content">
        <!--begin::Portlet-->
        <div  class="row">
            <div class="col-md-12">
                @if (session('status') == 1)
                <div class="m-alert m-alert--outline alert alert-success alert-dismissible fade show" role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>
                    <strong>Glückwünsche!</strong>  {{ session('msg') }}					  	
                </div>
                @endif   
            </div>
            <div class="col-lg-12">
                <div class="m-portlet">
                    <div class="m-portlet__head">
                        <div class="m-portlet__head-caption">
                            <div class="m-portlet__head-title">
                                <span class="m-portlet__head-icon m--hide">
                                    <i class="la la-gear"></i>
                                </span>
                                <h3 class="m-portlet__head-text">{{ __('backend.general_settings') }}</h3>
                            </div>
                        </div>
                    </div>
                    <!--begin::Form-->
                    <form action="{{ Route('settings_update') }}" method="post" class="m-form m-form--group-seperator-dashed" enctype="multipart/form-data">
                        <div class="m-portlet__body">
                            <div class="col-lg-12">
                                <ul class="nav nav-tabs  m-tabs-line m-tabs-line--success" role="tablist">
                                    <li class="nav-item m-tabs__item">
                                        <a class="nav-link m-tabs__link active" data-toggle="tab" href="#header" role="tab">
                                            <i class="la la-globe"></i>
                                            {{ __('backend.header_settings') }}
                                        </a>
                                    </li>
                                    <li class="nav-item dropdown m-tabs__item">
                                        <a class="nav-link m-tabs__link" data-toggle="tab" href="#footer" role="tab">
                                            <i class="la la-cog"></i>
                                            {{ __('backend.footer_settings') }}
                                        </a>
                                    </li>
                                </ul>
                                <div class="tab-content">
                                    <div class="tab-pane active" id="header" role="tabpanel">
                                        <div class="row">
                                            <div class="col-lg-6">
                                                @yield('content', View::make('admin.settings.partials.header-settings'))
                                            </div>    
                                        </div>
                                    </div>
                                    <div class="tab-pane" id="footer" role="tabpanel">
                                        <div class="row">
                                            <div class="col-lg-6">
                                                @yield('content', View::make('admin.settings.partials.footer-settings'))
                                            </div>
                                            <div class="col-lg-6">
                                                @yield('content', View::make('admin.settings.partials.footer-settings-social'))
                                            </div>
                                        </div>
                                    </div>
                                </div>    
                            </div>

                        </div>
                        <div class="m-portlet__foot m-portlet__no-border m-portlet__foot--fit">
                            <div class="m-form__actions m-form__actions--solid">
                                <div class="row">
                                    <div class="col-lg-10">
                                        <button type="submit" class="btn btn-success">
                                            {{ __('backend.save_changes') }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {{ csrf_field() }}
                    </form>
                    <!--end::Form-->
                </div>
            </div>
        </div>

    </div>
</div>

</div>
@endsection