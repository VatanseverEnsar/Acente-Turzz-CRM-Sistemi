@extends('layouts.app')
@section('main')
<div class="rs-banner style3 rs-rain-animate modify1">
    <div class="container">
        <div class="row">
            <div class="col-lg-7">
                <div class="banner-content">
                    <h1 class="title">Müşterilerin yeni evlerinde <span class="markatemsilci">Pronet</span> ile Güvende Olsun, Sen <span class="markatemsilci">{{ $kazanc->amount }} <i class="fa fa-turkish-lira"></i></span> Kazan!</h1>
                    <p class="desc">Bu çalışma kapsamında gayrimenkul danışmanları sattıkları ve/veya kiraladıkları tüm ev ve işyerleri için alarm sistemi kullanabileceğini düşündükleri müşterilerinin bilgilerini markatemsilcisi.net satış platformu üzerinden iletmesi yeterlidir .</p>

                    <p class="desc">Yönlendirilen müşterinin Pronet ailesine katılması halinde gayrimenkul danışmanı <span class="markatemsilci">{{ $kazanc->amount }} <i class="fa fa-turkish-lira"></i></span> kazanacaktır.</p>
                    <p  class="desc">Daha detaylı bilgi almak için <a href="tel:+90850 241 55 66"><span class="markatemsilci">0850 241 55 66</span></a> numaramızı arayarak bize ulaşabilirsiniz.</p>
                    <a class="readon started" href="{{ Route('register') }}">Hemen Üye Ol</a>

                </div>
            </div>
            <div class="col-lg-5">
                <div class="banner-img">
                    <img src="{{ asset('img/marka-bg-3.png') }}" alt=""/>
                </div>
                <div class="mobil-applications">
                    <a href="#"><img src="{{ asset('img/apple-store.png') }}"></a>
                    <a href="#"><img src="{{ asset('img/google-play-indir.png') }}"></a>
                </div>
            </div>
        </div>
    </div>
    @if( !$agent->isMobile() )
    <div class="line-inner style2">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
    </div>
    @endif
    <div class="rs-wave">
        @if( $agent->isMobile() )
        <svg viewBox="0 0 50 10">
        <pattern x="-7.5" id="waves" patternUnits="userSpaceOnUse" width="10" height="10">
            <path d="M0 10 V5 Q2.5 2.5 5 5 T10 5 V10" fill="#fff"></path>
        </pattern>
        <rect x="0" y="0" width="50" height="10" fill="url(#waves)"></rect>
        </svg>
        @else
        <svg viewBox="0 0 150 10">
        <pattern x="-7.5" id="waves" patternUnits="userSpaceOnUse" width="10" height="10">
            <path d="M0 10 V5 Q2.5 2.5 5 5 T10 5 V10" fill="#fff"></path>
        </pattern>
        <rect x="0" y="0" width="150" height="10" fill="url(#waves)"></rect>
        </svg>
        @endif
    </div>
</div>
<div id="rs-about" class="rs-about md-pt-70 pb-70">
    <div class="container">
        <div class="row">
            <div class="col-lg-5">
                <div class="sec-title mb-50">
                    <div class="sub-text style4-bg">Turzz.com</div>
                    <h2 class="title pb-20">
                        Kampanya Koşulları
                    </h2>
                    <div class="descs">
                        <ul>
                            <li>Kampanya satılan/kiralanan tüm konut ve işyerlerinde geçerlidir.</li>
                            <li>Kampanyadan, tüm emlakçılar, gayrimenkul danışmanları ve emlak ofisleri faydalanabilmektedir.</li>
                            <li>Firma olma zorunluluğu yoktur.</li>
                            <li>Kampanya kapsamında kazanılan komisyon montaj tamamlandığı gün net 1100 TL olarak markatemsilcisi.net ödeme bilglierim sayfasında kayıtlı olan banka hesabınıza yatacaktır</li>
                            <li>Kampanya kapsamında adet ya da komisyon sınırlaması yoktur. Sattıkça kazanabilirsiniz.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-lg-7">
                <!-- Services Section Start -->
                <div class="rs-services style3 md-pt-50">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-6 pr-10 pt-40 sm-pt-0 sm-pr-0 sm-pl-0">
                                <div class="services-item mb-20">
                                    <div class="services-icon">
                                        <div class="image-part">
                                            <img class="main-img" src="{{ asset('frontend/assets/images/services/style3/main-img/4.png') }}" alt=""/>
                                        </div>
                                    </div>
                                    <div class="services-content">
                                        <div class="services-text">
                                            <h3 class="title"><a href="javascript:void(0)">100% Güvenilir Sistem</a></h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="services-item">
                                    <div class="services-icon">
                                        <div class="image-part">
                                            <img class="main-img" src="{{ asset('frontend/assets/images/services/style3/main-img/3.png') }}" alt=""/>
                                        </div>
                                    </div>
                                    <div class="services-content">
                                        <div class="services-text">
                                            <h3 class="title"><a href="javascript:void(0)">7/24 Online Destek</a></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 pl-10 sm-pr-0 sm-pl-0 sm-mt-20">
                                <div class="services-item gold-bg mb-20">
                                    <div class="services-icon">
                                        <div class="image-part">
                                            <img class="main-img" src="{{ asset('frontend/assets/images/services/style3/main-img/9.png') }}" alt=""/>
                                        </div>
                                    </div>
                                    <div class="services-content">
                                        <div class="services-text">
                                            <h3 class="title"><a href="javascript:void(0)">Kolay Kullanım</a></h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="services-item blue-bg">
                                    <div class="services-icon">
                                        <div class="image-part">
                                            <img class="main-img" src="{{ asset('frontend/assets/images/services/style3/main-img/2.png') }}" alt=""/>
                                        </div>
                                    </div>
                                    <div class="services-content">
                                        <div class="services-text">
                                            <h3 class="title"><a href="javascript:void(0)">Ödeme Takip Sistemi</a></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Services Section End -->
            </div>
        </div>
    </div>
</div>

<div class="rs-mobilebanner">
    <div class="container">
        <div class="row align-items-center get-app-height">
            <div class="col-lg-6">
                <img src="{{ asset('img/marka-bg-3.png') }}" />
            </div>
            <div class="col-lg-6">
                <h2 class="section-title">Mobil Uygulamalarımızı İndirdiniz mi?</h2>
                <p>Şimdi mobil uygulamalarımızı App Store ve Play Store üzerinden indirebilirsiniz.</p>
                <div class="mobil-applications app_2">
                    <a href="#"><img src="https://markatemsilcisi.net/img/apple-store.png"></a>
                    <a href="#"><img src="https://markatemsilcisi.net/img/google-play-indir.png"></a>
                </div>
            </div>
            <!-- end section-titile -->
        </div>
    </div>
    @if( $agent->isMobile() )
    <svg viewBox="0 0 50 10">
    <pattern x="-7.5" id="waves" patternUnits="userSpaceOnUse" width="10" height="10">
        <path d="M0 10 V5 Q2.5 2.5 5 5 T10 5 V10" fill="#fff"></path>
    </pattern>
    <rect x="0" y="0" width="50" height="10" fill="url(#waves)"></rect>
    </svg>
    @else
    <svg viewBox="0 0 150 10">
    <pattern x="-7.5" id="waves" patternUnits="userSpaceOnUse" width="10" height="10">
        <path d="M0 10 V5 Q2.5 2.5 5 5 T10 5 V10" fill="#fff"></path>
    </pattern>
    <rect x="0" y="0" width="150" height="10" fill="url(#waves)"></rect>
    </svg>
    @endif
</div>
<div class="rs-counter style3 pt-20 pb-70">
    <div class="container">
        <div class="counter-top-area">
            <div class="row">
                <div class="col-sm-3 sm-pr-0 sm-pl-0 xs-mb-30">
                    <div class="counter-list">
                        <div class="count-image">
                            <img src="{{ asset('images/count-icon-1.png') }}" />
                        </div>
                        <div class="counter-text">
                            <div class="count-number">
                                <span class="rs-count orange-color">4342</span>
                            </div>
                            <h3 class="title">Üye Gayrimenkul Danışmanı</h3>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3 sm-pr-0 sm-pl-0">
                    <div class="counter-list">
                        <div class="count-image">
                            <img src="{{ asset('images/count-icon-2.png') }}" />
                        </div>
                        <div class="counter-text">
                            <div class="count-number">
                                <span class="rs-count orange-color">9675</span>
                            </div>
                            <h3 class="title">Yönlendirilen Müşteri</h3>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3 sm-pr-0 sm-pl-0">
                    <div class="counter-list">
                        <div class="count-image">
                            <img src="{{ asset('images/count-icon-3.png') }}" />
                        </div>
                        <div class="counter-text">
                            <div class="count-number">
                                <span class="rs-count orange-color">3458</span>
                            </div>
                            <h3 class="title">Kazanılan Müşteri</h3>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3 sm-pr-0 sm-pl-0">
                    <div class="counter-list">
                        <div class="count-image">
                            <img src="{{ asset('images/count-icon-4.png') }}" />
                        </div>
                        <div class="counter-text">
                            <div class="count-number">
                                <span class="rs-count orange-color">3830000</span> <span class="count-text-tl">TL</span>
                            </div>
                            <h3 class="title">Dağıtılan Kazanç Toplamı</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="rs-testimonial main-home rs-rain-animate style4 modify1 md-fixing">
    <div class="container">
        <div class="row">
            <div class="col-lg-4 hidden-md">
                <div class="testi-image">
                    <img src="{{ asset('images/nediyor-background.png') }}" alt="">
                </div>
            </div>
            <div class="col-lg-8 pl-50 md-pl-15">
                <div class="sec-title mb-50">
                    <div class="sub-text style4-bg left testi">Markatemsilcisi.net</div>
                    <h2 class="title pb-20">
                        Kullananlar Ne Diyor?
                    </h2>
                    <div class="desc">
                        Daha önce sistemimizi kullanarak kazanç elde eden kullanıcılarımızın yorumlarını sizler için derledik. Sizde aramıza katılarak müşterilerin Pronet ile güvende olsun.
                    </div>
                </div>
                <div class="rs-carousel owl-carousel"
                     data-loop="true"
                     data-items="1"
                     data-margin="30"
                     data-autoplay="true"
                     data-hoverpause="true"
                     data-autoplay-timeout="5000"
                     data-smart-speed="800"
                     data-dots="true"
                     data-nav="false"
                     data-nav-speed="false"

                     data-md-device="1"
                     data-md-device-nav="false"
                     data-md-device-dots="false"
                     data-center-mode="false"

                     data-ipad-device2="1"
                     data-ipad-device-nav2="false"
                     data-ipad-device-dots2="false"

                     data-ipad-device="1"
                     data-ipad-device-nav="false"
                     data-ipad-device-dots="true"

                     data-mobile-device="1"
                     data-mobile-device-nav="false"
                     data-mobile-device-dots="false">
                    <div class="testi-item">
                        <img class="quote" src="{{ asset('frontend/assets/images/testimonial/main-home/quote2.png') }}" alt=""/>
                        <div class="author-desc">
                            <div class="desc">
                                Emlakçılıktan sonra en çok para kazandığım iş oldu, akaryakıt, ilan gibi giderlerimi her ay buradan kazandığım gelir ile karşılıyorum. Sistemin en beğendiğim yanı puan flan değil doğrudan para ile çalışıyor olması.
                            </div>
                        </div>
                        <div class="testimonial-content">
                            <div class="author-part">
                                <a class="name" href="#">Semih Nacar</a>
                                <span class="designation">Gayrimenkul Danışmanı</span>
                            </div>
                        </div>
                    </div>
                    <div class="testi-item">
                        <img class="quote" src="{{ asset('frontend/assets/images/testimonial/main-home/quote2.png') }}" alt=""/>
                        <div class="author-desc">
                            <div class="desc">
                                İlk Başta bu kadar kolay olabileceğine ve ödemelerin 3-4 gün içinde yapıldığına inanamamıştım. Şimdi alışkanlık oldu kiralama yapar yapmaz bilgilerini gönderiyorum.
                            </div>
                        </div>
                        <div class="testimonial-content">
                            <div class="author-part">
                                <a class="name" href="#">Özgür Çağlar</a>
                                <span class="designation">Gayrimenkul Danışmanı</span>
                            </div>
                        </div>
                    </div>
                    <div class="testi-item">
                        <img class="quote" src="{{ asset('frontend/assets/images/testimonial/main-home/quote2.png') }}" alt=""/>
                        <div class="author-desc">
                            <div class="desc">
                                Birkaç kez benim kiralama yaptığım müşterilerin Pronet’i arayıp alarm taktırdıklarını gördükten sonra ikna olduğum sistem, 1100 TL iyi rakam
                            </div>
                        </div>
                        <div class="testimonial-content">
                            <div class="author-part">
                                <a class="name" href="#">Bilge İrem Güneş</a>
                                <span class="designation">Gayrimenkul Danışmanı</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="rs-partner pt-80 pb-70">
    <div class="container">
        <div class="call-action-box">
            <h2>Her Ay alarm satınalan binlerce kullanıcının  % 75’inin yeni bir ev yada iş yeri kiralayanlardan oluştuğunu biliyor muydunuz? </h2>
            <h3>Hemen Katıl Fırsatı Kaçırma!</h3>
            <a href="{{ Route('register') }}" class="btn btn-hemen-ktl"><i class="flaticon-link-2"></i> Hemen Katıl</a>
        </div>
    </div>
</div>
</div>
@endsection
