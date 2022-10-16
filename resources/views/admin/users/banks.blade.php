@extends('admin.layouts.app')
@section('main')
<div class="subheader py-2 py-lg-6 subheader-solid" id="kt_subheader">
    <div class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
        <button class="burger-icon burger-icon-left mr-4 d-inline-block d-lg-none" id="kt_subheader_mobile_toggle">
            <span></span>
        </button>
        <div class="d-flex align-items-center flex-wrap mr-2">
            <!--begin::Page Title-->
            <h5 class="text-dark font-weight-bold mt-2 mb-2 mr-5">Kullanıcı Banka Bilgileri</h5>
            <div class="subheader-separator subheader-separator-ver mt-2 mb-2 mr-4 bg-gray-200"></div>
            <span class="text-muted font-weight-bold mr-4">#{{ @$user->id }}, {{ @$user->name }}</span>

            <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                <li class="breadcrumb-item">
                    <a href="{{ Route('admin_users') }}" class="text-muted">Kullanıcılar</a>
                </li>
                <li class="breadcrumb-item">
                    <a href="{{ Route('admin_user_banks',['id'=>$user->id]) }}" class="text-muted">Kullanıcı Banka Bilgileri</a>
                </li>
            </ul>
        </div>
        <!--end::Info-->
        <!--begin::Toolbar-->
        <div class="d-flex align-items-center">
            <a href="{{ Route('admin_user_add_banks', ['id'=>$user->id]) }}" class="btn btn-light-primary font-weight-bolder btn-sm mr-5">Yeni Banka Hesabı Ekle</a>
        </div>
        <!--end::Toolbar-->
    </div>
</div>

<div class="d-flex flex-column-fluid">
    <!--begin::Container-->
    <div class="container">
        @if( $user->email_verified_at == NULL )
        <div class="alert alert-custom alert-notice alert-light-warning shadow-sm fade show mb-5" role="alert">
            <div class="alert-icon">
                <i class="flaticon-warning"></i>
            </div>
            <div class="alert-text">Kullanıcı hesabı henüz onaylanmamıştır! Manuel olarak onaylamak istiyorsanız, lütfen <span class="font-weight-bold text-danger">Hesabı Onayla</span> butonuna tıklayınız.</div>
            <div class="alert-close">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">
                        <i class="ki ki-close"></i>
                    </span>
                </button>
            </div>
        </div>
        @endif
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
        <div class="d-flex flex-row">
            <!--begin::Aside-->
            <div class="flex-row-auto offcanvas-mobile w-250px w-xxl-350px" id="kt_profile_aside">
                @include('admin.users.partials.user-side-menu')
            </div>
            <!--end::Aside-->
            <!--begin::Content-->
            <div class="flex-row-fluid ml-lg-8">

                <div class="card card-custom card-stretch">
                    <!--begin::Header-->
                    <div class="card-header py-3">
                        <div class="card-title align-items-start flex-column">
                            <h3 class="card-label font-weight-bolder text-dark">Banka Hesap Bilgileri</h3>
                            <span class="text-muted font-weight-bold font-size-sm mt-1"><span class="font-weight-boldest">{{ $user->name }}</span> kullanıcısı için yeni hesap ekleyebilir ya da var olan hesabı düzenleyebilirsiniz.</span>
                        </div>
                        <div class="card-toolbar">
                            @if( $user->email_verified_at == NULL )
                            <button type="button" class="btn btn-warning mr-2 applyUser" data-id="{{ $user->id }}">Hesabı Onayla</button>
                            @endif
                            <a href="{{ Route('admin_user_add_banks', ['id'=>$user->id]) }}" class="btn btn-success mr-2 editUser">Yeni Hesap Ekle</a>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="tab-content">
                            <div class="table-responsive">
                                <table class="table table-head-custom table-head-bg table-borderless table-vertical-center">
                                    <thead>
                                        <tr class="text-left text-uppercase">
                                            <th style="min-width: 100px">Hesap Adı/Banka Adı</th>
                                            <th style="min-width: 100px">IBAN</th>
                                            <th style="min-width: 100px">Oluşturulma Tarihi</th>
                                            <th style="min-width: 100px">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody class="pt-2 pb-0 mt-n3">
                                        @foreach( \App\Models\BankAccounts::where('user_id', $user->id)->orderBy('created_at', 'DESC')->get() as $account )

                                        <tr>
                                            <td>
                                                <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ $account->bank_account_name }}</span>
                                                <span class="text-muted font-weight-bold">{{ $account->bank_name }}</span>
                                            </td>
                                            <td>
                                                <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ $account->iban }}</span>
                                            </td>
                                            <td>
                                                <span class="text-muted font-weight-bold">{{  \Carbon\Carbon::parse($account->created_at)->isoFormat('DD MMMM YYYY, ddd') }}</span>
                                            </td>
                                            <td>
                                                <a href="{{ Route('admin_user_edit_banks', ['user_id' => $user->id,'id'=>$account->bank_id]) }}" class="btn btn-icon btn-light btn-hover-primary btn-sm mx-3">
                                                    <span class="svg-icon svg-icon-md svg-icon-primary">
                                                        <!--begin::Svg Icon | path:assets/media/svg/icons/Communication/Write.svg-->
                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <rect x="0" y="0" width="24" height="24" />
                                                        <path d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z" fill="#000000" fill-rule="nonzero" transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953)" />
                                                        <path d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z" fill="#000000" fill-rule="nonzero" opacity="0.3" />
                                                        </g>
                                                        </svg>
                                                        <!--end::Svg Icon-->
                                                    </span>
                                                </a>
                                                <a href="javascript:void(0)" class="btn btn-icon btn-light btn-hover-primary btn-sm delBankAccount" data-id="{{ $user->id }}" data-bankid="{{ $account->bank_id }}">
                                                    <span class="svg-icon svg-icon-md svg-icon-primary">
                                                        <!--begin::Svg Icon | path:assets/media/svg/icons/General/Trash.svg-->
                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <rect x="0" y="0" width="24" height="24" />
                                                        <path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero" />
                                                        <path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3" />
                                                        </g>
                                                        </svg>
                                                        <!--end::Svg Icon-->
                                                    </span>
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
            <!--end::Content-->
        </div>
        <!--end::Profile Personal Information-->
    </div>
    <!--end::Container-->
</div>
<!--end::Entry-->
@endsection

