<html lang="tr" >
    <!-- begin::Head -->
    <head>
        <meta charset="utf-8" />
    <title>Hesabınızı Onaylayınız | Turzz Yönetim Sistemi</title>
    <meta name="description" content="Login page example" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, maximum-scale=1.0 minimal-ui" />
    <!--begin::Fonts-->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" />
    <!--end::Fonts-->
    <!--begin::Page Custom Styles(used by this page)-->
    <link href="{{ asset('backend/assets/css/pages/login/login-1.css') }}" rel="stylesheet" type="text/css" />
    <!--end::Page Custom Styles-->
    <!--begin::Global Theme Styles(used by all pages)-->
    <link href="{{ asset('backend/assets/plugins/global/plugins.bundle.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('backend/assets/plugins/custom/prismjs/prismjs.bundle.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('backend/assets/css/style.bundle.css') }}" rel="stylesheet" type="text/css" />
    <!--end::Global Theme Styles-->
    <!--begin::Layout Themes(used by all pages)-->
    <link href="{{ asset('backend/assets/css/themes/layout/header/base/light.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('backend/assets/css/themes/layout/header/menu/light.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('backend/assets/css/themes/layout/brand/dark.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('backend/assets/assets/css/themes/layout/aside/dark.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('admin/css/style.css?v=1.9') }}" rel="stylesheet" type="text/css" />
    <link rel="apple-touch-icon" sizes="57x57" href="https://cdnd.pronet.com.tr/assets/img/favicon/apple-touch-icon-57x57.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="https://cdnd.pronet.com.tr/assets/img/favicon/apple-touch-icon-114x114.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="https://cdnd.pronet.com.tr/assets/img/favicon/apple-touch-icon-72x72.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="https://cdnd.pronet.com.tr/assets/img/favicon/apple-touch-icon-144x144.png" />
    <link rel="apple-touch-icon" sizes="60x60" href="https://cdnd.pronet.com.tr/assets/img/favicon/apple-touch-icon-60x60.png" />
    <link rel="apple-touch-icon" sizes="120x120" href="https://cdnd.pronet.com.tr/assets/img/favicon/apple-touch-icon-120x120.png" />
    <link rel="apple-touch-icon" sizes="76x76" href="https://cdnd.pronet.com.tr/assets/img/favicon/apple-touch-icon-76x76.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="https://cdnd.pronet.com.tr/assets/img/favicon/apple-touch-icon-152x152.png" />
    <link rel="icon" type="image/png" href="https://cdnd.pronet.com.tr/assets/img/favicon/favicon-196x196.png" sizes="196x196" />
    <link rel="icon" type="image/png" href="https://cdnd.pronet.com.tr/assets/img/favicon/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/png" href="https://cdnd.pronet.com.tr/assets/img/favicon/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="https://cdnd.pronet.com.tr/assets/img/favicon/favicon-16x16.png" sizes="16x16" />
    <link rel="icon" type="image/png" href="https://cdnd.pronet.com.tr/assets/img/favicon/favicon-128.png" sizes="128x128" />
</head>
<body id="kt_body" class="header-fixed header-mobile-fixed subheader-enabled subheader-fixed aside-enabled aside-fixed aside-minimize-hoverable page-loading">
    <!--begin::Main-->
<div class="d-flex flex-column flex-root">
    <!--begin::Login-->
    <div class="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-column-fluid bg-white" id="kt_login">
        <!--begin::Aside-->
        <div class="login-aside d-flex flex-column flex-row-auto" style="background-color: #1e1e2d;background-image: url({{ asset('backend/assets/media/bg/bg-2.jpg') }});">
            <!--begin::Aside Top-->
            <div class="d-flex flex-column-auto flex-column pt-lg-10 pt-15">
                <!--begin::Aside header-->
                <a href="{{ Route('login') }}" class="text-center mb-10">
                    <img src="{{ asset('images/pronet.png') }}" class="max-h-70px" alt="" />
                </a>
                <!--end::Aside header-->
                <!--begin::Aside title-->
                <h3 class="font-weight-bolder text-center font-size-h4 font-size-h1-lg" style="color: #c8c8c8;">Mobil uygulamalarımızı
                    <br />indirdiniz mi?</h3>
                <div class="mobil-applications">
                    <a href="#"><img src="{{ asset('img/apple-store.png') }}" /></a>
                    <a href="#"><img src="{{ asset('img/google-play-indir.png') }}" /></a>
                </div>
            </div>
            <!--end::Aside Top-->
            <!--begin::Aside Bottom-->
            <div class="aside-img d-flex flex-row-fluid bgi-no-repeat bgi-position-y-bottom bgi-position-x-center" style="background-image: url({{ asset('img/marka-bg-3.png') }})"></div>
            <!--end::Aside Bottom-->
        </div>
        <!--begin::Aside-->
        <!--begin::Content-->
        <div class="login-content flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
            <!--begin::Content body-->
            <div class="d-flex flex-column-fluid flex-center">
                <div class="">
                    @if (session('resent'))
                        <div class="alert alert-success" role="alert">
                            {{ __('Hesabınızı onaylamanız için e-posta adresinize yeni bir bağlantı gönderildi.') }}
                        </div>
                    @endif
                    <h3 class="font-weight-bolder text-dark font-size-h4 font-size-h1-lg">Hesabınız onay sürecindedir.</h3>
                    <p class="text-muted font-weight-bold font-size-h4">Bilgileriniz alınmıştır, üyeliğinizi aktif hale getirmek için müşteri temsilcimiz en kısa sürede size ulaşacaktır.</p>
                    <a href="{{ Route('logout') }}">Anasayfa'ya Dön</a>

                </div>
            </div>
            <!--end::Content body-->
            <!--begin::Content footer-->
            <div class="d-flex justify-content-lg-start justify-content-center align-items-end py-7 py-lg-0">
                <div class="text-dark-50 font-size-lg font-weight-bolder mr-10">
                    <span class="mr-1">2021©</span>
                    <a href="{{ Route('login') }}" target="_blank" class="text-dark-75 text-hover-primary">markatemsilci.net</a>
                </div>
                <a href="{{ Route('login') }}" class="text-primary font-weight-bolder font-size-lg">Giriş Yap</a>
                <a href="{{ Route('password.request') }}" class="text-primary ml-5 font-weight-bolder font-size-lg">Şifre Yenile</a>
            </div>
            <!--end::Content footer-->
        </div>
        <!--end::Content-->
    </div>
    <!--end::Login-->
</div>
<script>var KTAppSettings = { "breakpoints": { "sm": 576, "md": 768, "lg": 992, "xl": 1200, "xxl": 1400 }, "colors": { "theme": { "base": { "white": "#ffffff", "primary": "#3699FF", "secondary": "#E5EAEE", "success": "#1BC5BD", "info": "#8950FC", "warning": "#FFA800", "danger": "#F64E60", "light": "#E4E6EF", "dark": "#181C32" }, "light": { "white": "#ffffff", "primary": "#E1F0FF", "secondary": "#EBEDF3", "success": "#C9F7F5", "info": "#EEE5FF", "warning": "#FFF4DE", "danger": "#FFE2E5", "light": "#F3F6F9", "dark": "#D6D6E0" }, "inverse": { "white": "#ffffff", "primary": "#ffffff", "secondary": "#3F4254", "success": "#ffffff", "info": "#ffffff", "warning": "#ffffff", "danger": "#ffffff", "light": "#464E5F", "dark": "#ffffff" } }, "gray": { "gray-100": "#F3F6F9", "gray-200": "#EBEDF3", "gray-300": "#E4E6EF", "gray-400": "#D1D3E0", "gray-500": "#B5B5C3", "gray-600": "#7E8299", "gray-700": "#5E6278", "gray-800": "#3F4254", "gray-900": "#181C32" } }, "font-family": "Poppins" };</script>
<script src="{{ asset('backend/assets/plugins/global/plugins.bundle.js') }}"></script>
<script src="{{ asset('backend/assets/plugins/custom/prismjs/prismjs.bundle.js') }}"></script>
<script src="{{ asset('backend/assets/js/scripts.bundle.js') }}"></script>
</body>

</html>
