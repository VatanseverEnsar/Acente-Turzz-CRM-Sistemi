@extends('admin.layouts.app')

@section('main')
<div class="m-grid__item m-grid__item--fluid m-wrapper">
    <!-- BEGIN: Subheader -->
    <div class="m-subheader ">
        <div class="d-flex align-items-center">
            <div class="mr-auto">
                <h3 class="m-subheader__title m-subheader__title--separator">Languages</h3>
                <ul class="m-subheader__breadcrumbs m-nav m-nav--inline">
                    <li class="m-nav__item m-nav__item--home">
                        <a href="{{ Route('dashboard') }}" class="m-nav__link m-nav__link--icon">
                            <i class="m-nav__link-icon la la-home"></i>
                        </a>
                    </li>
                    <li class="m-nav__separator">
                        -
                    </li>
                    <li class="m-nav__item">
                        <a href="#" class="m-nav__link">
                            <span class="m-nav__link-text">{{ __('backend.dashboard') }}</span>
                        </a>
                    </li>
                    <li class="m-nav__separator">
                        -
                    </li>
                    <li class="m-nav__item">
                        <a href="#" class="m-nav__link">
                            <span class="m-nav__link-text">
                                Languages
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
            <div class="col-md-6">
                <div class="m-portlet">
                    <div class="m-portlet__head">
                        <div class="m-portlet__head-caption">
                            <div class="m-portlet__head-title">
                                <span class="m-portlet__head-icon">
                                    <i class="flaticon-placeholder-2"></i>
                                </span>
                                <h3 class="m-portlet__head-text">
                                    {{ __('translation::translation.languages') }}
                                </h3>
                            </div>
                        </div>
                        <div class="m-portlet__head-tools">
                            <ul class="m-portlet__nav">
                                <li class="m-portlet__nav-item">
                                    <a href="{{ route('languages.create') }}" class="btn btn-primary">
                                        <i class="la la-plus"></i> {{ __('translation::translation.add') }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="m-portlet__body">
                        <table class="table table-striped- table-bordered table-hover table-checkable" id="m_table_1">
                            <thead>
                                <tr>
                                    <th title="Field #1">{{ __('translation::translation.language_name') }}</th>
                                    <th title="Field #2">{{ __('translation::translation.locale') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($languages as $language => $name)
                                <tr>
                                    <td>{{ $name }}</td>
                                    <td>
                                        <a href="{{ route('languages.translations.index', $language) }}">
                                            {{ $language }}
                                        </a>
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table> 
                    </div>
                </div>   
            </div>
        </div>

    </div>
</div>
@if(count($languages))



@endif
</div>
@endsection