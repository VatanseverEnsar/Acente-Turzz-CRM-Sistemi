<!DOCTYPE html>
<html lang="tr">
    <head>
        <meta charset="utf-8">
    <title>{{ $title }}</title>
    <meta name="description" content=""/>
    <meta http-equiv="x-ua-compatible" content="ie=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
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
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/assets/css/bootstrap.min.css') }}"/>
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/assets/css/font-awesome.min.css') }}"/>
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/assets/fonts/flaticon.css') }}"/>
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/assets/css/animate.css') }}"/>
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/assets/css/owl.carousel.css') }}"/>
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/assets/css/slick.css') }}"/>
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/assets/css/off-canvas.css') }}"/>
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/assets/css/magnific-popup.css') }}"/>
    <link rel="stylesheet" href="{{ asset('frontend/assets/css/rsmenu-main.css') }}"/>
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/assets/css/rs-spacing.css') }}"/>
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/style.css?v=1.19') }}"/>
    <link rel="stylesheet" type="text/css" href="{{ asset('frontend/assets/css/responsive.css?v=1.0') }}"/>
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WPJM9BN');</script>
<!-- End Google Tag Manager -->

</head>
<body class="defult-home">
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WPJM9BN"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<div class="main-content">
    <div class="full-width-header">
        <header id="rs-header" class="rs-header style3 modify2 header-transparent">
            <div class="menu-area menu-sticky">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-2">
                            <div class="logo-part">
                                <a href="{{ Route('tanitim') }}">
                                    <img class="normal-logo" src="{{ asset('images/pronet.png') }}" alt="logo"/>
                                    <img class="sticky-logo" src="{{ asset('images/pronet.png') }}" alt="logo"/>
                                </a>
                            </div>
                            <div class="mobile-menu">
                                <a href="{{ Route('login') }}" class="rs-menu-toggle">
                                    <i class="fa fa-sign-in"></i>
                                </a>
                            </div>
                        </div>
                        <div class="col-lg-10 text-right">
                            <div class="rs-menu-area">
                                <div class="expand-btn-inner search-icon hidden-md">
                                    <ul>
                                        <li><a class="quote-btn" href="{{ Route('register') }}"><i class="fa fa-user-plus" aria-hidden="true"></i> Hemen Üye Ol</a></li>
                                        <li><a class="quote-btn" href="{{ Route('login') }}">Giriş Yap <i class="fa fa-sign-in" aria-hidden="true"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

    </div>

    @yield('main')

    <footer id="rs-footer" class="rs-footer">
        <div class="footer-top">
            <div class="container">
                <div class="header_footer">
                    <h3>İletişim Bilgileri</h3>
                </div>
                <div class="row">
                    <div class="col-lg-3 col-md-12 col-sm-12 footer-widget">
                        <h3 class="widget-title">Adres</h3>
                        <ul class="address-widget">
                            <li>
                                <i class="flaticon-location"></i>
                                <div class="desc">Fulya Mh. Prof. Dr. Bülent Tarcan Cd. No:6 Kat:2 Şişli / İstanbul</div>
                            </li>
                        </ul>
                    </div>
                    <div class="col-lg-3 col-md-12 col-sm-12 footer-widget">
                        <h3 class="widget-title">Telefon</h3>
                        <ul class="address-widget">
                            <li>
                                <i class="flaticon-call"></i>
                                <div class="desc">
                                    <a href="tel:+908502415566">0 850 241 55 66</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="col-lg-3 col-md-12 col-sm-12 footer-widget">
                        <h3 class="widget-title">E-Posta</h3>
                        <ul class="address-widget">
                            <li>
                                <i class="flaticon-email"></i>
                                <div class="desc">
                                    <a href="mailto:iletisim@markatemsilcisi.net">iletisim@markatemsilcisi.net</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="col-lg-3 col-md-12 col-sm-12 footer-widget">
                        <h3 class="widget-title">WhatsApp</h3>
                        <ul class="address-widget">
                            <li>
                                <i class="flaticon-clock"></i>
                                <div class="desc">
                                    <a href="https://wa.me/905304147577">0 530 414 75 77</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container">
                <div class="row y-middle">
                    <div class="col-lg-6">
                        <div class="copyright">
                            <p>&copy; 2021 Tüm Hakları Saklıdır. Powered By Turzz</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </footer>
    <script src="{{ asset('frontend/assets/js/modernizr-2.8.3.min.js') }}"></script>
    <script src="{{ asset('frontend/assets/js/jquery.min.js') }}"></script>
    <script src="{{ asset('frontend/assets/js/bootstrap.min.js') }}"></script>
    <script src="{{ asset('frontend/assets/js/jquery.nav.js') }}"></script>
    <script src="{{ asset('frontend/assets/js/owl.carousel.min.js') }}"></script>
    <script src="{{ asset('frontend/assets/js/wow.min.js') }}"></script>
    <script src="{{ asset('frontend/assets/js/skill.bars.jquery.js') }}"></script>
    <script src="{{ asset('frontend/assets/js/jquery.counterup.min.js') }}"></script>
    <script src="{{ asset('frontend/assets/js/waypoints.min.js') }}"></script>
    <script src="{{ asset('frontend/assets/js/swiper.min.js') }}"></script>
    <script src="{{ asset('frontend/assets/js/particles.min.js') }}"></script>
    <script src="{{ asset('frontend/assets/js/jquery.magnific-popup.min.js') }}"></script>
    <script src="{{ asset('frontend/assets/js/plugins.js') }}"></script>
    <script src="{{ asset('frontend/assets/js/pointer.js') }}"></script>
    <script src="{{ asset('frontend/assets/js/contact.form.js') }}"></script>
    <script src="{{ asset('frontend/assets/js/main.js') }}"></script>

</body>
</html>
