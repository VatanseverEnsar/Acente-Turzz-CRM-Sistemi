@extends('admin.layouts.app')

@section('main')
<div class="subheader py-2 py-lg-6 subheader-solid" id="kt_subheader">
    <div class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
        <!--begin::Info-->
        <div class="d-flex align-items-center flex-wrap mr-1">
            <!--begin::Page Heading-->
            <div class="d-flex align-items-baseline flex-wrap mr-5">
                <!--begin::Page Title-->
                <h5 class="text-dark font-weight-bold my-1 mr-5">Yeni Kullanıcı Ekle</h5>
                <!--end::Page Title-->
                <!--begin::Breadcrumb-->
                <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">

                    <li class="breadcrumb-item">
                        <a href="{{ Route('admin_users') }}" class="text-muted">Kullanıcılar</a>
                    </li>
                    <li class="breadcrumb-item">
                        <a href="{{ Route('admin_user_add') }}" class="text-muted">Yeni Kullanıcı Ekle</a>
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
            <a href="{{ Route('admin_users') }}" class="btn btn-primary font-weight-bolder">Kullanıcılar</a>

        </div>
        <!--end::Toolbar-->
    </div>
</div>
<!--begin::Entry-->
<div class="d-flex flex-column-fluid">
    <!--begin::Container-->
    <div class="container">
        <!--begin::Card-->
        <div class="card card-custom">
            <div class="card-body p-0">
                <!--begin::Wizard-->
                <div class="wizard wizard-1" id="kt_wizard" data-wizard-state="step-first" data-wizard-clickable="false">
                    <!--begin::Wizard Nav-->
                    <div class="wizard-nav border-bottom">
                        <div class="wizard-steps p-8 p-lg-10">
                            <div class="wizard-step" data-wizard-type="step" data-wizard-state="current">
                                <div class="wizard-wrapper">
                                    <div class="wizard-number">1</div>
                                    <div class="wizard-label">
                                        <div class="wizard-title">Temel Bilgiler</div>
                                        <div class="wizard-desc">Kullanıcının temel bilgileri</div>
                                    </div>
                                </div>
                            </div>
                            <div class="wizard-step" data-wizard-type="step">
                                <div class="wizard-wrapper">
                                    <div class="wizard-number">2</div>
                                    <div class="wizard-label">
                                        <div class="wizard-title">Hesap Bilgileri</div>
                                        <div class="wizard-desc">Kullanıcının hesap bilgileri</div>
                                    </div>
                                </div>
                            </div>
                            <div class="wizard-step" data-wizard-type="step">
                                <div class="wizard-wrapper">
                                    <div class="wizard-number">3</div>
                                    <div class="wizard-label">
                                        <div class="wizard-title">Kullanıcı Oluştur</div>
                                        <div class="wizard-desc">Kullanıcıyı sisteme ekle</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--end::Wizard Nav-->
                    <!--begin::Card-->
                    <div class="card card-custom card-shadowless rounded-top-0">
                        <!--begin::Body-->
                        <div class="card-body p-0">
                            <div class="row justify-content-center py-8 px-8 py-lg-15 px-lg-10">
                                <div class="col-xl-12 col-xxl-10">
                                    <!--begin::Wizard Form-->
                                    <form class="form" id="kt_form" autocomplete="off">
                                        @csrf
                                        <div class="row justify-content-center">
                                            <div class="col-xl-9">
                                                <!--begin::Wizard Step 1-->
                                                <div class="my-5 step" data-wizard-type="step-content" data-wizard-state="current">
                                                    <div class="form-group row">
                                                        <label class="col-xl-3 col-lg-3 col-form-label">İsim</label>
                                                        <div class="col-lg-9 col-xl-9">
                                                            <input class="form-control form-control-solid form-control-lg" name="firstname" type="text" value="" autocomplete="off" />
                                                        </div>
                                                    </div>
                                                    <!--end::Group-->
                                                    <!--begin::Group-->
                                                    <div class="form-group row">
                                                        <label class="col-xl-3 col-lg-3 col-form-label">Soyisim</label>
                                                        <div class="col-lg-9 col-xl-9">
                                                            <input class="form-control form-control-solid form-control-lg" name="lastname" type="text" value="" autocomplete="off" />
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label class="col-xl-3 col-lg-3 col-form-label">E-posta Adresi</label>
                                                        <div class="col-lg-9 col-xl-9">
                                                            <div class="input-group input-group-solid input-group-lg">
                                                                <div class="input-group-prepend">
                                                                    <span class="input-group-text">
                                                                        <i class="la la-at"></i>
                                                                    </span>
                                                                </div>
                                                                <input type="text" class="form-control form-control-solid form-control-lg" name="email" value="" autocomplete="off" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label class="col-xl-3 col-lg-3 col-form-label">Şifre</label>
                                                        <div class="col-lg-9 col-xl-9">
                                                            <input class="form-control form-control-solid form-control-lg" name="password" type="password"  autocomplete="new-password" />
                                                            <span class="form-text text-muted">En az 8 haneli bir şifre giriniz.</span>
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label class="col-xl-3 col-lg-3 col-form-label">Şifre Tekrar</label>
                                                        <div class="col-lg-9 col-xl-9">
                                                            <input class="form-control form-control-solid form-control-lg" name="password_confirm" type="password"  autocomplete="off" />
                                                            <span class="form-text text-muted">Lütfen şifrenizi tekrar giriniz.</span>
                                                        </div>
                                                    </div>

                                                </div>
                                                <!--end::Wizard Step 1-->
                                                <!--begin::Wizard Step 2-->
                                                <div class="my-5 step" data-wizard-type="step-content">
                                                    <h5 class="text-dark font-weight-bold mb-10 mt-5">Kullanıcı Hesap Bilgileri</h5>
                                                    <div class="form-group row">
                                                        <label class="col-xl-2 col-lg-2 col-form-label">Telefon No.</label>
                                                        <div class="col-lg-6 col-xl-6">
                                                            <div class="input-group input-group-solid input-group-lg">
                                                                <div class="input-group-prepend">
                                                                    <span class="input-group-text">
                                                                        <i class="la la-phone"></i>
                                                                    </span>
                                                                </div>
                                                                <input type="text" class="form-control form-control-solid form-control-lg" name="phone"  placeholder="Telefon No." autocomplete="off"/>
                                                            </div>
                                                            <span class="form-text text-muted">Lütfen geçerli bir numara giriniz.(ör:: 5302451****).</span>
                                                        </div>
                                                    </div>
                                                    <!--end::Group-->
                                                    <div class="separator separator-dashed my-10"></div>
                                                    <h5 class="text-dark font-weight-bold mb-10">Kullanıcı Hesap Ayarları</h5>
                                                    <div class="form-group row fv-plugins-icon-container has-success">
                                                        <label class="col-form-label col-xl-3 col-lg-3">Kullanıcı Rolü</label>
                                                        <div class="col-xl-9 col-lg-9 col-form-label">
                                                            <div class="checkbox-inline">
                                                                @foreach( $roles as $role )
                                                                <label class="checkbox">
                                                                    <input name="account_role" type="radio"  value="{!! $role->id !!}"/>
                                                                    <span></span>{!! $role->name !!}
                                                                </label>
                                                                @endforeach
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="my-5 step" data-wizard-type="step-content">
                                                    <h5 class="mb-10 font-weight-bold text-dark">Kullanıcı oluşturmak için lütfen onaylayınız.</h5>
                                                    <div class="alert alert-custom alert-light-warning fade show mb-10" role="alert">
                                                        <div class="alert-icon">
                                                            <span class="svg-icon svg-icon-3x svg-icon-warning">
                                                                <!--begin::Svg Icon | path:assets/media/svg/icons/Code/Info-circle.svg-->
                                                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                                <rect x="0" y="0" width="24" height="24"></rect>
                                                                <circle fill="#000000" opacity="0.3" cx="12" cy="12" r="10"></circle>
                                                                <rect fill="#000000" x="11" y="10" width="2" height="7" rx="1"></rect>
                                                                <rect fill="#000000" x="11" y="7" width="2" height="2" rx="1"></rect>
                                                                </g>
                                                                </svg>
                                                                <!--end::Svg Icon-->
                                                            </span>
                                                        </div>
                                                        <div class="alert-text font-weight-bold">Kullanıcı oluştur butonuna tıklayarak girmiş olduğunuz bilgiler ile kullanıcı oluşturabilirsiniz. Kullanıcı eklemeyi iptal etmek için lütfen hiç bir işlem yapmayınız.</div>
                                                        <div class="alert-close">
                                                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                                <span aria-hidden="true">
                                                                    <i class="ki ki-close"></i>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!--end::Wizard Step 4-->
                                                <!--begin::Wizard Actions-->
                                                <div class="d-flex justify-content-between border-top pt-10 mt-15">
                                                    <div class="mr-2">
                                                        <button type="button" id="prev-step" class="btn btn-light-primary font-weight-bolder px-9 py-4" data-wizard-type="action-prev">Geri</button>
                                                    </div>
                                                    <div>
                                                        <button type="button" class="btn btn-success font-weight-bolder px-9 py-4" data-wizard-type="action-submit">Kullanıcıyı Oluştur</button>
                                                        <button type="button" id="next-step" class="btn btn-primary font-weight-bolder px-9 py-4" data-wizard-type="action-next">İleri</button>
                                                    </div>
                                                </div>
                                                <!--end::Wizard Actions-->
                                            </div>
                                        </div>
                                    </form>
                                    <!--end::Wizard Form-->
                                </div>
                            </div>
                        </div>
                        <!--end::Body-->
                    </div>
                    <!--end::Card-->
                </div>
                <!--end::Wizard-->
            </div>
        </div>
        <!--end::Card-->
    </div>
    <!--end::Container-->
</div>

@endsection
