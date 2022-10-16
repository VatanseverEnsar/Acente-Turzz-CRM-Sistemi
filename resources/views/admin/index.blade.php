@extends('admin.layouts.app')

@section('main')
<div class="subheader py-2 py-lg-4 subheader-solid" id="kt_subheader">
    <div class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
        <!--begin::Info-->
        <div class="d-flex align-items-center flex-wrap mr-2">
            <!--begin::Page Title-->
            <h5 class="text-dark font-weight-bold mt-2 mb-2 mr-5">Kontrol Paneli</h5>
            <!--end::Page Title-->
            <!--begin::Actions-->
            <div class="subheader-separator subheader-separator-ver mt-2 mb-2 mr-4 bg-gray-200"></div>
            <!--end::Actions-->

        </div>
    </div>
</div>

<div class="d-flex flex-column-fluid">
    <div class="container">
        <div class="row">
            <div class="col-xl-3 col-6">
                <!--begin::Stats Widget 29-->
                <div class="card card-custom bg-info bgi-no-repeat card-stretch gutter-b" style="background-position: right top; background-size: 30% auto; background-image: url({{ asset('backend/assets/media/svg/shapes/abstract-1.svg') }})">
                    <!--begin::Body-->
                    <div class="card-body">
                        @role(['admin'])
                        <span class="card-title font-weight-bolder text-white font-size-h2 mb-0 mt-6 d-block">{{ \App\Models\Customers::where('status', 0)->count() }}</span>
                        @else
                        <span class="card-title font-weight-bolder text-white font-size-h2 mb-0 mt-6 d-block">{{ \App\Models\Customers::where('user_id', Auth()->user()->id)->where('status', 0)->count() }}</span>
                        @endrole
                        <span class="font-weight-bold text-white font-size-sm">Beklemede</span>
                    </div>
                    <!--end::Body-->
                </div>
                <!--end::Stats Widget 29-->
            </div>
            <div class="col-xl-3 col-6">
                <!--begin::Stats Widget 29-->
                <div class="card card-custom bg-warning bgi-no-repeat card-stretch gutter-b" style="background-position: right top; background-size: 30% auto; background-image: url({{ asset('backend/assets/media/svg/shapes/abstract-1.svg') }})">
                    <!--begin::Body-->
                    <div class="card-body">
                        @role(['admin'])
                        <span class="card-title font-weight-bolder text-white font-size-h2 mb-0 mt-6 d-block">{{ \App\Models\Customers::where('status', 1)->count() }}</span>
                        @else
                        <span class="card-title font-weight-bolder text-white font-size-h2 mb-0 mt-6 d-block">{{ \App\Models\Customers::where('user_id', Auth()->user()->id)->where('status', 1)->count() }}</span>
                        @endrole
                        <span class="font-weight-bold text-white font-size-sm">İşleniyor</span>
                    </div>
                    <!--end::Body-->
                </div>
                <!--end::Stats Widget 29-->
            </div>
            <div class="col-xl-3 col-6">
                <!--begin::Stats Widget 29-->
                <div class="card card-custom bg-danger bgi-no-repeat card-stretch gutter-b" style="background-position: right top; background-size: 30% auto; background-image: url({{ asset('backend/assets/media/svg/shapes/abstract-1.svg') }})">
                    <!--begin::Body-->
                    <div class="card-body">
                        @role(['admin'])
                        <span class="card-title font-weight-bolder text-white font-size-h2 mb-0 mt-6 d-block">{{ \App\Models\Customers::where('status', 2)->count() }}</span>
                        @else
                        <span class="card-title font-weight-bolder text-white font-size-h2 mb-0 mt-6 d-block">{{ \App\Models\Customers::where('user_id', Auth()->user()->id)->where('status', 2)->count() }}</span>
                        @endrole
                        <span class="font-weight-bold text-white font-size-sm">Red</span>
                    </div>
                    <!--end::Body-->
                </div>
                <!--end::Stats Widget 29-->
            </div>
            <div class="col-xl-3 col-6">
                <!--begin::Stats Widget 29-->
                <div class="card card-custom bg-success bgi-no-repeat card-stretch gutter-b" style="background-position: right top; background-size: 30% auto; background-image: url({{ asset('backend/assets/media/svg/shapes/abstract-1.svg') }})">
                    <!--begin::Body-->
                    <div class="card-body">
                        @role(['admin'])
                        <span class="card-title font-weight-bolder text-white font-size-h2 mb-0 mt-6 d-block">{{ \App\Models\Customers::where('status', 3)->count() }}</span>
                        @else
                        <span class="card-title font-weight-bolder text-white font-size-h2 mb-0 mt-6 d-block">{{ \App\Models\Customers::where('user_id', Auth()->user()->id)->where('status', 3)->count() }}</span>
                        @endrole
                        <span class="font-weight-bold text-white font-size-sm">Satış</span>
                    </div>
                    <!--end::Body-->
                </div>
                <!--end::Stats Widget 29-->
            </div>
        </div>
        <div class="row">
            <div class="col-lg-4 col-xxl-4">
                <div class="card card-custom bg-gray-100 card-stretch gutter-b">
                    <!--begin::Header-->
                    <div class="card-header border-0 bg-danger py-5">
                        <h3 class="card-title font-weight-bolder text-white">Hızlı İşlemler</h3>

                    </div>
                    <!--end::Header-->
                    <!--begin::Body-->
                    <div class="card-body p-0 position-relative overflow-hidden">
                        <!--begin::Chart-->
                        <div id="kt_mixed_widget_1_chart" class="card-rounded-bottom bg-danger" style="height: 200px"></div>
                        <!--end::Chart-->
                        <!--begin::Stats-->
                        <div class="card-spacer mt-n25">
                            <!--begin::Row-->
                            <div class="row m-0">
                                <div class="col bg-light-warning px-6 py-8 rounded-xl mr-7 mb-7">
                                    <span class="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                                        <!--begin::Svg Icon | path:assets/media/svg/icons/Media/Equalizer.svg-->
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                <rect x="0" y="0" width="24" height="24" />
                                                <rect fill="#000000" opacity="0.3" x="13" y="4" width="3" height="16" rx="1.5" />
                                                <rect fill="#000000" x="8" y="9" width="3" height="11" rx="1.5" />
                                                <rect fill="#000000" x="18" y="11" width="3" height="9" rx="1.5" />
                                                <rect fill="#000000" x="3" y="13" width="3" height="7" rx="1.5" />
                                            </g>
                                        </svg>
                                        <!--end::Svg Icon-->
                                    </span>
                                    <a href="#" class="text-warning font-weight-bold font-size-h6">Raporlamalar</a>
                                </div>
                                <div class="col bg-light-primary px-6 py-8 rounded-xl mb-7">
                                    <span class="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
                                        <!--begin::Svg Icon | path:assets/media/svg/icons/Communication/Add-user.svg-->
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                <polygon points="0 0 24 0 24 24 0 24" />
                                                <path d="M18,8 L16,8 C15.4477153,8 15,7.55228475 15,7 C15,6.44771525 15.4477153,6 16,6 L18,6 L18,4 C18,3.44771525 18.4477153,3 19,3 C19.5522847,3 20,3.44771525 20,4 L20,6 L22,6 C22.5522847,6 23,6.44771525 23,7 C23,7.55228475 22.5522847,8 22,8 L20,8 L20,10 C20,10.5522847 19.5522847,11 19,11 C18.4477153,11 18,10.5522847 18,10 L18,8 Z M9,11 C6.790861,11 5,9.209139 5,7 C5,4.790861 6.790861,3 9,3 C11.209139,3 13,4.790861 13,7 C13,9.209139 11.209139,11 9,11 Z" fill="#000000" fill-rule="nonzero" opacity="0.3" />
                                                <path d="M0.00065168429,20.1992055 C0.388258525,15.4265159 4.26191235,13 8.98334134,13 C13.7712164,13 17.7048837,15.2931929 17.9979143,20.2 C18.0095879,20.3954741 17.9979143,21 17.2466999,21 C13.541124,21 8.03472472,21 0.727502227,21 C0.476712155,21 -0.0204617505,20.45918 0.00065168429,20.1992055 Z" fill="#000000" fill-rule="nonzero" />
                                            </g>
                                        </svg>
                                        <!--end::Svg Icon-->
                                    </span>
                                    <a href="#" class="text-primary font-weight-bold font-size-h6 mt-2">Yeni Kullanıcı</a>
                                </div>
                            </div>
                            <!--end::Row-->
                            <!--begin::Row-->
                            <div class="row m-0">
                                <div class="col bg-light-danger px-6 py-8 rounded-xl mr-7">
                                    <span class="svg-icon svg-icon-3x svg-icon-danger d-block my-2">
                                        <!--begin::Svg Icon | path:assets/media/svg/icons/Design/Layers.svg-->
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                <polygon points="0 0 24 0 24 24 0 24" />
                                                <path d="M12.9336061,16.072447 L19.36,10.9564761 L19.5181585,10.8312381 C20.1676248,10.3169571 20.2772143,9.3735535 19.7629333,8.72408713 C19.6917232,8.63415859 19.6104327,8.55269514 19.5206557,8.48129411 L12.9336854,3.24257445 C12.3871201,2.80788259 11.6128799,2.80788259 11.0663146,3.24257445 L4.47482784,8.48488609 C3.82645598,9.00054628 3.71887192,9.94418071 4.23453211,10.5925526 C4.30500305,10.6811601 4.38527899,10.7615046 4.47382636,10.8320511 L4.63,10.9564761 L11.0659024,16.0730648 C11.6126744,16.5077525 12.3871218,16.5074963 12.9336061,16.072447 Z" fill="#000000" fill-rule="nonzero" />
                                                <path d="M11.0563554,18.6706981 L5.33593024,14.122919 C4.94553994,13.8125559 4.37746707,13.8774308 4.06710397,14.2678211 C4.06471678,14.2708238 4.06234874,14.2738418 4.06,14.2768747 L4.06,14.2768747 C3.75257288,14.6738539 3.82516916,15.244888 4.22214834,15.5523151 C4.22358765,15.5534297 4.2250303,15.55454 4.22647627,15.555646 L11.0872776,20.8031356 C11.6250734,21.2144692 12.371757,21.2145375 12.909628,20.8033023 L19.7677785,15.559828 C20.1693192,15.2528257 20.2459576,14.6784381 19.9389553,14.2768974 C19.9376429,14.2751809 19.9363245,14.2734691 19.935,14.2717619 L19.935,14.2717619 C19.6266937,13.8743807 19.0546209,13.8021712 18.6572397,14.1104775 C18.654352,14.112718 18.6514778,14.1149757 18.6486172,14.1172508 L12.9235044,18.6705218 C12.377022,19.1051477 11.6029199,19.1052208 11.0563554,18.6706981 Z" fill="#000000" opacity="0.3" />
                                            </g>
                                        </svg>
                                        <!--end::Svg Icon-->
                                    </span>
                                    <a href="#" class="text-danger font-weight-bold font-size-h6 mt-2">Rezervasyonlar</a>
                                </div>
                                <div class="col bg-light-success px-6 py-8 rounded-xl">
                                    <span class="svg-icon svg-icon-3x svg-icon-success d-block my-2">
                                        <!--begin::Svg Icon | path:assets/media/svg/icons/Communication/Urgent-mail.svg-->
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                <rect x="0" y="0" width="24" height="24" />
                                                <path d="M12.7037037,14 L15.6666667,10 L13.4444444,10 L13.4444444,6 L9,12 L11.2222222,12 L11.2222222,14 L6,14 C5.44771525,14 5,13.5522847 5,13 L5,3 C5,2.44771525 5.44771525,2 6,2 L18,2 C18.5522847,2 19,2.44771525 19,3 L19,13 C19,13.5522847 18.5522847,14 18,14 L12.7037037,14 Z" fill="#000000" opacity="0.3" />
                                                <path d="M9.80428954,10.9142091 L9,12 L11.2222222,12 L11.2222222,16 L15.6666667,10 L15.4615385,10 L20.2072547,6.57253826 C20.4311176,6.4108595 20.7436609,6.46126971 20.9053396,6.68513259 C20.9668779,6.77033951 21,6.87277228 21,6.97787787 L21,17 C21,18.1045695 20.1045695,19 19,19 L5,19 C3.8954305,19 3,18.1045695 3,17 L3,6.97787787 C3,6.70173549 3.22385763,6.47787787 3.5,6.47787787 C3.60510559,6.47787787 3.70753836,6.51099993 3.79274528,6.57253826 L9.80428954,10.9142091 Z" fill="#000000" />
                                            </g>
                                        </svg>
                                        <!--end::Svg Icon-->
                                    </span>
                                    <a href="#" class="text-success font-weight-bold font-size-h6 mt-2">Hata Bildir</a>
                                </div>
                            </div>
                            <!--end::Row-->
                        </div>
                        <!--end::Stats-->
                    </div>
                    <!--end::Body-->
                </div>
                <!--end::Mixed Widget 1-->
            </div>
            <div class="col-lg-8 col-xl-8">
                <div class="card card-custom card-stretch gutter-b">
                    <!--begin::Header-->
                    <div class="card-header h-auto border-0">
                        <div class="card-title py-5">
                            <h3 class="card-label">
                                <span class="d-block text-dark font-weight-bolder">Güncel İstatistikler</span>
                                <span class="d-block text-muted mt-2 font-size-sm">Son 15 günün güncel istatistikleri</span>
                            </h3>
                        </div>
                        <div class="card-toolbar">
                            <span class="mr-5 d-flex align-items-center font-weight-bold">
                                <i class="label label-dot label-xl label-info mr-2"></i>Rezervasyonlar</span>
                            <span class="mr-5 d-flex align-items-center font-weight-bold">
                                <i class="label label-dot label-xl label-primary mr-2"></i>Kullanıcılar</span>
                            <span class="d-flex align-items-center font-weight-bold">
                                <i class="label label-light-primary label-dot label-xl mr-2"></i>İçerik</span>
                        </div>
                    </div>
                    <!--end::Header-->
                    <!--begin::Body-->
                    <div class="card-body">
                        <div class="row">
                            <div class="col-4 d-flex flex-column">
                                <!--begin::Block-->
                                <div class="bg-light-warning p-8 rounded-xl flex-grow-1">
                                    <!--begin::Item-->
                                    <div class="d-flex align-items-center mb-5">
                                        <div class="symbol symbol-circle symbol-white symbol-30 flex-shrink-0 mr-3">
                                            <div class="symbol-label">
                                                <span class="svg-icon svg-icon-md svg-icon-danger">
                                                    <!--begin::Svg Icon | path:assets/media/svg/icons/Shopping/Cart3.svg-->
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                            <rect x="0" y="0" width="24" height="24"/>
                                                            <path d="M3,10.0500091 L3,8 C3,7.44771525 3.44771525,7 4,7 L9,7 L9,9 C9,9.55228475 9.44771525,10 10,10 C10.5522847,10 11,9.55228475 11,9 L11,7 L21,7 C21.5522847,7 22,7.44771525 22,8 L22,10.0500091 C20.8588798,10.2816442 20,11.290521 20,12.5 C20,13.709479 20.8588798,14.7183558 22,14.9499909 L22,17 C22,17.5522847 21.5522847,18 21,18 L11,18 L11,16 C11,15.4477153 10.5522847,15 10,15 C9.44771525,15 9,15.4477153 9,16 L9,18 L4,18 C3.44771525,18 3,17.5522847 3,17 L3,14.9499909 C4.14112016,14.7183558 5,13.709479 5,12.5 C5,11.290521 4.14112016,10.2816442 3,10.0500091 Z M10,11 C9.44771525,11 9,11.4477153 9,12 L9,13 C9,13.5522847 9.44771525,14 10,14 C10.5522847,14 11,13.5522847 11,13 L11,12 C11,11.4477153 10.5522847,11 10,11 Z" fill="#000000" opacity="1" transform="translate(12.500000, 12.500000) rotate(-45.000000) translate(-12.500000, -12.500000) "/>
                                                        </g>
                                                    </svg>
                                                    <!--end::Svg Icon-->
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-size-sm font-weight-bold">10</div>
                                            <div class="font-size-sm text-muted">Rezervasyonlar</div>
                                        </div>
                                    </div>
                                    <!--end::Item-->
                                    <!--begin::Item-->
                                    <div class="d-flex align-items-center mb-5">
                                        <div class="symbol symbol-circle symbol-white symbol-30 flex-shrink-0 mr-3">
                                            <div class="symbol-label">
                                                <span class="svg-icon svg-icon-md svg-icon-info">
                                                    <!--begin::Svg Icon | path:assets/media/svg/icons/Home/Library.svg-->
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                            <polygon points="0 0 24 0 24 24 0 24"/>
                                                            <path d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"/>
                                                            <path d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z" fill="#000000" fill-rule="nonzero"/>
                                                        </g>
                                                    </svg>
                                                    <!--end::Svg Icon-->
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-size-sm font-weight-bold">10</div>
                                            <div class="font-size-sm text-muted">Kullanıcılar</div>
                                        </div>
                                    </div>
                                    <!--end::Item-->
                                    <!--begin::Item-->
                                    <div class="d-flex align-items-center mb-5">
                                        <div class="symbol symbol-circle symbol-white symbol-30 flex-shrink-0 mr-3">
                                            <div class="symbol-label">
                                                <span class="svg-icon svg-icon-md svg-icon-warning">
                                                    <!--begin::Svg Icon | path:assets/media/svg/icons/Design/Flip-vertical.svg-->
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                            <rect x="0" y="0" width="24" height="24"/>
                                                            <path d="M8,3 L8,3.5 C8,4.32842712 8.67157288,5 9.5,5 L14.5,5 C15.3284271,5 16,4.32842712 16,3.5 L16,3 L18,3 C19.1045695,3 20,3.8954305 20,5 L20,21 C20,22.1045695 19.1045695,23 18,23 L6,23 C4.8954305,23 4,22.1045695 4,21 L4,5 C4,3.8954305 4.8954305,3 6,3 L8,3 Z" fill="#000000" opacity="0.3"/>
                                                            <path d="M11,2 C11,1.44771525 11.4477153,1 12,1 C12.5522847,1 13,1.44771525 13,2 L14.5,2 C14.7761424,2 15,2.22385763 15,2.5 L15,3.5 C15,3.77614237 14.7761424,4 14.5,4 L9.5,4 C9.22385763,4 9,3.77614237 9,3.5 L9,2.5 C9,2.22385763 9.22385763,2 9.5,2 L11,2 Z" fill="#000000"/>
                                                            <rect fill="#000000" opacity="0.3" x="7" y="10" width="5" height="2" rx="1"/>
                                                            <rect fill="#000000" opacity="0.3" x="7" y="14" width="9" height="2" rx="1"/>
                                                        </g>
                                                    </svg>
                                                    <!--end::Svg Icon-->
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-size-sm font-weight-bold">10</div>
                                            <div class="font-size-sm text-muted">Blog Yazısı</div>
                                        </div>
                                    </div>
                                    <!--end::Item-->
                                    <!--begin::Item-->
                                    <div class="d-flex align-items-center mb-5">
                                        <div class="symbol symbol-circle symbol-white symbol-30 flex-shrink-0 mr-3">
                                            <div class="symbol-label">
                                                <span class="svg-icon svg-icon-md svg-icon-success">
                                                    <!--begin::Svg Icon | path:assets/media/svg/icons/Home/Cupboard.svg-->
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                            <rect x="0" y="0" width="24" height="24" />
                                                            <path d="M3.5,3 L9.5,3 C10.3284271,3 11,3.67157288 11,4.5 L11,18.5 C11,19.3284271 10.3284271,20 9.5,20 L3.5,20 C2.67157288,20 2,19.3284271 2,18.5 L2,4.5 C2,3.67157288 2.67157288,3 3.5,3 Z M9,9 C8.44771525,9 8,9.44771525 8,10 L8,12 C8,12.5522847 8.44771525,13 9,13 C9.55228475,13 10,12.5522847 10,12 L10,10 C10,9.44771525 9.55228475,9 9,9 Z" fill="#000000" opacity="0.3" />
                                                            <path d="M14.5,3 L20.5,3 C21.3284271,3 22,3.67157288 22,4.5 L22,18.5 C22,19.3284271 21.3284271,20 20.5,20 L14.5,20 C13.6715729,20 13,19.3284271 13,18.5 L13,4.5 C13,3.67157288 13.6715729,3 14.5,3 Z M20,9 C19.4477153,9 19,9.44771525 19,10 L19,12 C19,12.5522847 19.4477153,13 20,13 C20.5522847,13 21,12.5522847 21,12 L21,10 C21,9.44771525 20.5522847,9 20,9 Z" fill="#000000" transform="translate(17.500000, 11.500000) scale(-1, 1) translate(-17.500000, -11.500000)" />
                                                        </g>
                                                    </svg>
                                                    <!--end::Svg Icon-->
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-size-sm font-weight-bold">10</div>
                                            <div class="font-size-sm text-muted">Destinasyon</div>
                                        </div>
                                    </div>
                                    <!--end::Item-->
                                    <!--begin::Item-->
                                    <div class="d-flex align-items-center mb-5">
                                        <div class="symbol symbol-circle symbol-white symbol-30 flex-shrink-0 mr-3">
                                            <div class="symbol-label">
                                                <span class="svg-icon svg-icon-md svg-icon-primary">
                                                    <!--begin::Svg Icon | path:assets/media/svg/icons/Media/Equalizer.svg-->
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                            <polygon points="0 0 24 0 24 24 0 24"/>
                                                            <path d="M6,5 L18,5 C19.6568542,5 21,6.34314575 21,8 L21,17 C21,18.6568542 19.6568542,20 18,20 L6,20 C4.34314575,20 3,18.6568542 3,17 L3,8 C3,6.34314575 4.34314575,5 6,5 Z M5,17 L14,17 L9.5,11 L5,17 Z M16,14 C17.6568542,14 19,12.6568542 19,11 C19,9.34314575 17.6568542,8 16,8 C14.3431458,8 13,9.34314575 13,11 C13,12.6568542 14.3431458,14 16,14 Z" fill="#000000"/>
                                                        </g>
                                                    </svg>
                                                    <!--end::Svg Icon-->
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-size-sm font-weight-bold">10</div>
                                            <div class="font-size-sm text-muted">Seyahat Rehberi</div>
                                        </div>
                                    </div>
                                    <!--end::Item-->
                                    <!--begin::Item-->
                                    <div class="d-flex align-items-center">
                                        <div class="symbol symbol-circle symbol-white symbol-30 flex-shrink-0 mr-3">
                                            <div class="symbol-label">
                                                <span class="svg-icon svg-icon-md svg-icon-danger">
                                                    <!--begin::Svg Icon | path:assets/media/svg/icons/Shopping/Pound.svg-->
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                            <rect x="0" y="0" width="24" height="24"/>
                                                            <path d="M15,3 L15.4502481,7.5024814 C15.4784917,7.78491722 15.7161555,8 16,8 C16.2838445,8 16.5215083,7.78491722 16.5497519,7.5024814 L17,3 L18,3 L18.4502481,7.5024814 C18.4784917,7.78491722 18.7161555,8 19,8 C19.2838445,8 19.5215083,7.78491722 19.5497519,7.5024814 L20,3 L21,3 L21,7.5 C21,9.43299662 19.4329966,11 17.5,11 C15.5670034,11 14,9.43299662 14,7.5 L14,3 L15,3 Z" fill="#000000"/>
                                                            <path d="M17.5,13 L17.5,13 C18.0610373,13 18.5243493,13.4382868 18.55547,13.9984604 L18.916795,20.5023095 C18.9602658,21.2847837 18.3611851,21.9543445 17.5787108,21.9978153 C17.5524991,21.9992715 17.5262521,22 17.5,22 L17.5,22 C16.7163192,22 16.0810203,21.3647011 16.0810203,20.5810203 C16.0810203,20.5547682 16.0817488,20.5285212 16.083205,20.5023095 L16.44453,13.9984604 C16.4756507,13.4382868 16.9389627,13 17.5,13 Z" fill="#000000" opacity="0.3"/>
                                                            <path d="M7.5,14 L7.5,14 C8.06209761,14 8.5273156,14.4370496 8.56237829,14.9980526 L8.90643257,20.5029211 C8.95497952,21.2796724 8.3646533,21.9487088 7.58790204,21.9972557 C7.55863704,21.9990848 7.52932209,22 7.5,22 L7.5,22 C6.72173313,22 6.09082317,21.36909 6.09082317,20.5908232 C6.09082317,20.5615011 6.09173837,20.5321861 6.09356743,20.5029211 L6.43762171,14.9980526 C6.4726844,14.4370496 6.93790239,14 7.5,14 Z" fill="#000000" opacity="0.3"/>
                                                            <path d="M7.5,12 C5.56700338,12 4,9.43299662 4,7.5 C4,5.56700338 5.56700338,3 7.5,3 C9.43299662,3 11,5.56700338 11,7.5 C11,9.43299662 9.43299662,12 7.5,12 Z M7.5095372,4.60103244 L7.56069005,9.94758244 C8.61891495,9.8578583 9.45855912,8.97981222 9.47749614,7.8949109 C9.49728809,6.76103086 8.63275447,4.70470991 7.5095372,4.60103244 Z" fill="#000000"/>
                                                        </g>
                                                    </svg>
                                                    <!--end::Svg Icon-->
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-size-sm font-weight-bold">10</div>
                                            <div class="font-size-sm text-muted">Yeme İçme</div>
                                        </div>
                                    </div>
                                    <!--end::Item-->
                                </div>
                                <!--end::Block-->
                            </div>
                            <div class="col-8">
                                <div id="kt_charts_widget_6_chart"></div>
                            </div>
                        </div>
                    </div>
                    <!--end::Body-->
                </div>
            </div>


        </div>
        <!--end::Row-->
        <!--begin::Row-->
        <div class="row">

        </div>
        <!--end::Row-->
        <!--end::Dashboard-->
    </div>
    <!--end::Container-->
</div>
@endsection
