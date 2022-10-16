<html lang="tr" >
    <!-- begin::Head -->
    <head>
        <meta charset="utf-8" />
    <title>Hesap Oluştur | Turzz Yönetim Sistemi</title>
    <meta name="description" content="Pronet için müşterilerinizi bize gönderin, görüşmeleri biz yapalım siz kazanın." />
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
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WPJM9BN');</script>
<!-- End Google Tag Manager -->
</head>
<body id="kt_body" class="header-fixed header-mobile-fixed subheader-enabled subheader-fixed aside-enabled aside-fixed aside-minimize-hoverable page-loading">
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WPJM9BN"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
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
                <!--begin::Signin-->
                <div class="login-form login-signin">
                    <form class="form" action="{{ route('register') }}" method="POST">
                        <div class="pb-13 pt-lg-0 pt-5">
                            <h3 class="font-weight-bolder text-dark font-size-h4 font-size-h1-lg">Yeni Hesap Oluştur</h3>
                            <p class="text-muted font-weight-bold font-size-h4">Hesap bilgilerinizi girerek yeni bir hesap oluşturun.</p>
                        </div>
                        <div class="row">
                            <div class="form-group col-lg-6">
                                <div class="d-flex justify-content-between mt-n5">
                                    <label class="font-size-h6 font-weight-bolder text-dark">Adınız</label>

                                </div>
                                <input class="form-control form-control-solid h-auto py-3{{ $errors->has('first_name') ? ' is-invalid' : '' }}" type="text" name="first_name" value="{{ old('first_name') }}" autocomplete="off" />
                                @if ($errors->has('first_name'))
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $errors->first('first_name') }}</strong>
                                </span>
                                @endif
                            </div>
                            <div class="form-group col-lg-6">
                                <div class="d-flex justify-content-between mt-n5">
                                    <label class="font-size-h6 font-weight-bolder text-dark">Soyadınız</label>

                                </div>
                                <input class="form-control form-control-solid h-auto py-3{{ $errors->has('last_name') ? ' is-invalid' : '' }}" type="text" name="last_name" value="{{ old('last_name') }}" autocomplete="off" />
                                @if ($errors->has('last_name'))
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $errors->first('last_name') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-lg-6">
                                <div class="d-flex justify-content-between mt-n5">
                                    <label class="font-size-h6 font-weight-bolder text-dark">Şehir</label>

                                </div>
                                <select class="form-control form-control-solid h-auto py-3 {{ $errors->has('city') ? ' is-invalid' : '' }}" type="text" name="city" autocomplete="off" required>
                                    <option selected="true" disabled="disabled">Şeçiniz</option>
                                    @foreach( \App\Models\City::all() as $city )
                                    <option value="{{ $city->CityID }}">{{ $city->CityName }}</option>
                                    @endforeach
                                </select>
                                @if ($errors->has('city'))
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $errors->first('city') }}</strong>
                                </span>
                                @endif
                            </div>
                            <div class="form-group col-lg-6">
                                <div class="d-flex justify-content-between mt-n5">
                                    <label class="font-size-h6 font-weight-bolder text-dark">İlçe</label>

                                </div>
                                <select class="form-control form-control-solid h-auto py-3" type="text" name="town" autocomplete="off" >

                                </select>

                            </div>
                        </div>
                        <div class="form-group">
                            <label class="font-size-h6 font-weight-bolder text-dark">E-posta adresi</label>
                            <input class="form-control form-control-solid h-auto py-3 {{ $errors->has('email') ? ' is-invalid' : '' }}" type="text" name="email" value="{{ old('email') }}" autocomplete="off" />
                            @if ($errors->has('email'))
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $errors->first('email') }}</strong>
                            </span>
                            @endif
                        </div>
                        <div class="form-group">
                            <label class="font-size-h6 font-weight-bolder text-dark">Telefon</label>
                            <input class="form-control form-control-solid h-auto py-3 {{ $errors->has('phone') ? ' is-invalid' : '' }}" type="text" name="phone" value="{{ old('phone') }}" autocomplete="off" />
                            @if ($errors->has('phone'))
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $errors->first('phone') }}</strong>
                            </span>
                            @endif
                        </div>
                        <div class="row">
                            <div class="form-group col-lg-6">
                                <div class="d-flex justify-content-between mt-n5">
                                    <label class="font-size-h6 font-weight-bolder text-dark">Şifre</label>

                                </div>
                                <input class="form-control form-control-solid h-auto py-3{{ $errors->has('password') ? ' is-invalid' : '' }}" type="password" name="password" autocomplete="off" />
                                @if ($errors->has('password'))
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $errors->first('password') }}</strong>
                                </span>
                                @endif
                            </div>
                            <div class="form-group col-lg-6">
                                <div class="d-flex justify-content-between mt-n5">
                                    <label class="font-size-h6 font-weight-bolder text-dark">Şifre Tekrar</label>

                                </div>
                                <input id="password-confirm" class="form-control form-control-solid h-auto py-3" type="password" name="password_confirmation" autocomplete="off" />

                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-lg-12">
                                <label class="checkbox">
                                    <input type="checkbox" name="terms" id="terms" value="1" />
                                    <span class="mr-2"></span><a href="javascript:void(0)" class="mr-2" data-toggle="modal" data-target="#termsModal">Kullanıcı sözleşmesini </a> okudum anladım.</label>
                                @if ($errors->has('terms'))
                                <span class="text-danger" role="alert">
                                    <strong>{{ $errors->first('terms') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-lg-12">
                                <label class="checkbox">
                                    <input type="checkbox" name="kvkk" id="kvkk" value="1" />
                                    <span class="mr-2"></span><a href="javascript:void(0)" class="mr-2" data-toggle="modal" data-target="#kvkkModal">KVKK metnini </a> okudum ve kabul ediyorum.</label>
                                @if ($errors->has('kvkk'))
                                <span class="text-danger" role="alert">
                                    <strong>{{ $errors->first('kvkk') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>
                        <div class="pb-lg-0 pb-5">
                            @csrf
                            <button type="submit" class="btn btn-primary font-weight-bolder font-size-h6 px-8 py-4 my-3 mr-3 fullbtnwidth">Kayıt Ol</button>
                        </div>
                        <!--end::Action-->
                    </form>
                    <!--end::Form-->
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
<div class="modal fade" id="termsModal" role="dialog" aria-labelledby="termsModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="termsLabel">Kullanıcı Sözleşmesi</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <i aria-hidden="true" class="ki ki-close"></i>
                </button>
            </div>
            <div class="modal-body">
                <h4><strong>( PSN ) Marka Temsilcisi Kullanıcı Sözleşmesi</strong></h4>
                <p><strong>1.TARAFTAR </strong></p>
                <p>Marka temsicisi satış platformu bir Pronet Çözüm Ortağı Platformudur. Markatemsicisi.net artık Pronet Çözüm Ortağı olarak anılacaktır.&nbsp; Site ‘ye üye olan PSN’ler Kullanıcı olarak anılacaktır.</p>
                <p><strong>2.SÖZLEŞMENİN KONUSU </strong></p>
                <p>Sözleşmenin konusu, Kullanıcı Pronet Güvenlik Hizmetleri A.Ş ‘nin (Bundan böyle Pronet olarak anılacaktır) adını kullanarak aboneler bulması ve bu kişilerin Çözüm Ortağı ile tanıştırılıp abonelik sözleşmesinin imzalanarak ürünün montajının yapılmasını ve ilk tahsilatın gerçekleşmesini müteakip işbu sözleşmenin 4.7 maddesinde belirtilen komisyonun kendisine ödenmesine ilişkin kabul ve şartların düzenlenmesidir.</p>
                <p><strong>3.PSN HAK VE YÜKÜMLÜLÜKLERİ </strong></p>
                <p>3.1 PSN, ürünlerin potansiyel müşterilere gerçeğe uygun şekilde tanıtılmasıyla her zaman ve her şart altında Pronet markası ve ticari itibarını gözetmekle ve potansiyel müşterinin Çözüm Ortağı ile abonelik sözleşmesi imzalaması için elinden gelen tüm çabayı göstermekle yükümlüdür.</p>
                <p>3.2 PSN bulacağı müşterinin Çözüm Ortağı ile abonelik sözleşmesi imzalamasını ve sözleşmeye konu ürünler montajının yapılması ve ilk tahsilatın gerçekleşmesini takiben sözleşmenin 4.7 maddesinde belirlenen komisyona hak kazanacaktır. PSNnin hak kazandığı komisyon ücreti Çözüm Ortağı tarafından ilgili sözleşmenin ödeme planı açıldıktan ve hizmet faturası gönderildikten sonra ödenecektir.</p>
                <p>3.3 PSN, Pronet ’in bilgisi ve yazılı onayı olmaksızın, ofisinde/dükkânında Pronet ‘in adını kullanarak tanıtım yapamaz, Pronet logolu malzemeler bastıramaz, yayınlayamaz ve dağıtamaz. Pronet, onay alınmadan yapılan her çalışma için yasal mercilere başvurma hakkını saklı tutar.</p>
                <p>3.4 Tüzel kişi olması halinde PSN işbu sözleşmenin imzalanmasından önce Ticaret Sicil Memurluğundan alınmış yeni tarihli Faaliyet belgesini, noter onaylı imza sirkülerini ve vergi levhası suretini Çözüm Ortağı’na sunmakla yükümlüdür.</p>
                <p>3.5. PSN adı altında toplanan alt bayi veya bağımsız kanallar, Çözüm Ortağı’na bağlı birer şube gibi sistemde konumlandırılamaz ve herhangi bir şekilde sözleşme alışverişi yapılamaz. Bu noktalar sadece müşteri adayı yaratabilmektedir.</p>
                <p>3.6. PSN’in verildiği ilde, daha sonradan yeni bir Pronet Güvenlik Hizmetleri AŞ’ye bağlı bir Çözüm Ortağı faaliyete başlaması halinde, o ilin Bölge Müdürü, yeni Çözüm Ortağı’yla PSN’in anlaşması halinde mevcut PSN’İ, yeni Çözüm Ortağı’na bağlayarak çalıştırılabilir. Aksi halde PSN’nin sözleşmesi iptal edilir.</p>
                <p><strong>4.ÇÖZÜM ORTAĞININ HAK VE YÜKÜMLÜLÜKLERİ </strong></p>
                <p>4.1. PSN olarak sisteme dahil edilecek alt bayi veya bağımsız kanallar mutlaka PSN sözleşmelerinin imzalı olarak, Bölge Müdürü’nün onayına sunulduktan sonra Pronet Güvenlik Hizmetleri AŞ’ye gönderilerek sisteme girişi yapılmalıdır.</p>
                <p>4.2. Farklı bir ildeki PSN’nın yarattığı müşteri adayı, bağlı bulunduğu Çözüm Ortağı’nın yönlendireceği bordrolu çalıştırdığı bir Güvenlik Danışmanı’nın giderek sözleşmeyi imzalaması gerekmektedir.</p>
                <p>4.3. PSN tarafından alınan bir sözleşmenin tespiti durumunda, alınan satış, Çözüm Ortağı’nın adetine dâhil edilmeyecektir ve PSN sözleşmesi iptal edilecektir.</p>
                <p>4.4. Sistemde kayıtlı olmayan bir PSN’den alınan satış durumunda ise, alınan satış, Çözüm Ortağı’nın adetine dahil edilmeyecek ve fraud işlemi yapılacaktır.</p>
                <p>4.5. Çözüm Ortağı, PSN’nin abone bulurken özenle hareket edip etmediğini, Pronet markasını, ticari itibarını ve ürünlerini tanıtırken ve pazarlarken yeterli niteliklere sahip olup olmadığını gözetmek ve denetlemekle yükümlüdür.</p>
                <p>4.6. Çözüm Ortağı, talebi halinde PSN’ye ürünlerin tanıtımı ve pazarlamasıyla ilgili olarak her türlü desteği sağlamakla yükümlüdür.</p>
                <p>4.7. Çözüm Ortağı, PSN tarafından kendisine getirilecek müşteriyle abonelik sözleşmesinin imzalanması ve ürünün montajının yapılmasını takiben hak edişini 1100 TL olarak PSN’e ödeyecektir.</p>
                <p>4.8. PSN tarafından pazarlanan ve sözleşmesinin imzalanmasını takiben montajı yapılan ürünlerin ayıplı çıkması halinde ortaya çıkabilecek tüm risk ve sorumluluklardan Çözüm Ortağı sorumlu olacaktır.</p>
                <p>4.9. Çözüm Ortağı PSN tarafından kendisiyle tanıştırılacak abone adaylarıyla sözleşme imzalayıp imzalamamak hususunda serbesttir. PSN sadece Çözüm Ortağı ile tanıştırdığı abone adaylarının sözleşme imzalaması, ürünün montajının yapılması ve ilk ödemesinin yapılması neticesinde komisyona hak kazanacaktır.</p>
                <p>4.10. PSN’ nin sadece komisyona hak kazanmak için ve tamamıyla kötü niyetli olarak Çözüm Ortağı ile tanıştırdığı bazı abonelerin sözleşmelerini yine geçerli bir sebep olmaksızın feshettiklerinin anlaşılması halinde, Çözüm Ortağı PSN’lik sözleşmesini tek taraflı feshetme ve Çözüm Ortağı’nın doğacak zararı PSN ‘den tazmin etme hakkı saklıdır.</p>
                <p><strong>5.GİZLİLİK </strong></p>
                <p>PSN işbu sözleşmenin imzalanmasıyla birlikte gerek Çözüm Ortağı’na gerekse Pronet’e ve gerekse tanıtım ve pazarlamasını yaptığı ürünlere ilişkin öğreneceği her türlü bilgi ve belgenin “Gizli Bilgi“ olduğunu, bu bilgi ve belgeleri muhtemel abone adayları ve resmi kurumlar tarafından kendisine yapılacak başvurular haricinde başka bir amaçla hiçbir koşul altında üçüncü kişilerle paylaşmayacağını, bu bilgileri yaymayacağını ve ifşa etmeyeceğini, kopyalamayacağını ve her koşul altında muhafaza edeceğini kabul ve taahhüt eder.</p>
                <p><strong>6.SÖZLEŞMENİN SÜRESİ VE FESHİ </strong></p>
                <p>İşbu sözleşme taraflarca imzalandığı tarihten itibaren 1(bir) yıl süre ile geçerli olmaktadır. PSN en geç 2(iki) hafta önceden yazılı olarak bildirimde bulunarak; Çözüm Ortağı ve Pronet ise dilediği zaman ve hiçbir gerekçe göstermeksizin sözleşmeyi feshedebilir.</p>
                <p><strong>7.TAZMİNAT</strong></p>
                <p>7.1 Bu sözleşme bir Çözüm Ortaklığı&nbsp; sözleşmesi degildir ve Çözüm Ortaklığı sözleşmesi olarak yorumlanmaz. PSN sadece abone ile Çözüm Ortağı’nı tanıştırdığı ve sözleşme imzalanarak montajın yapıldığı durumda komisyona hak kazanır.</p>
                <p>7.2 PSN, Çözüm Ortağı’ndan sözleşme feshedilmiş olsa dahi fesih tarihine kadar imzalanan sözleşme haricinde hiçbir hak, başlanılmış ama sonuçlanmamış işler tazminatı, alacak, portföy tazminatı ve masraf talep edemez.</p>
                <p><strong>8.SÖZLEŞME DEĞİŞİKLİKLERİ </strong></p>
                <p>İşbu sözleşmede yapılacak bütün değişiklikler taraflardan her ikisinin de yazılı onaylarının alınmasından sonra geçerli olacaktır.</p>
                <p><strong>9.TEBLİGAT VE YAZIŞMA </strong></p>
                <p>Hertürlü ihbar, ihtar ve bildirimler tarafların aşağıda yazılı tebligat adresine yapılacaktır.Tebligat adreslerindeki değişiklikler 3 (üç) gün içerisinde karşı tarafa yazılı olarak bildirilecektir</p>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light-primary font-weight-bold" data-dismiss="modal">Kapat</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="kvkkModal" role="dialog" aria-labelledby="kvkkModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="kvkkLabel">KVKK Metni</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <i aria-hidden="true" class="ki ki-close"></i>
                </button>
            </div>
            <div class="modal-body">
                <h3>Kişisel verileriniz Pronet koruması altında!<br>
                    Pronet olarak müşterilerimizin gizliliğine saygı duyuyor ve önem veriyoruz.</h3>
                <p>Şirketimiz (Pronet Güvenlik Hizmetleri A.Ş) ile çalışan/işveren ve ticari ilişkilerimiz kapsamında paylaştığınız kişisel verileriniz, Pronet’in koruması altındadır. İşleme amacı ile bağlantılı, sınırlı ve ölçülü olacak şekilde talep ettiğimiz ve/veya bizimle paylaşmış olduğunuz kişisel verilerinizin, yine işlenmelerini gerektiren amaç çerçevesinde; kaydedilebilecek, depolanabilecek, muhafaza edilebilecek, yeniden düzenlenebilecek, kanunen bu kişisel verileri talep etmeye yetkili olan kurumlar ile paylaşılabilecek, KVKK’nın öngördüğü şartlarda, yurtiçi veya yurtdışı üçüncü kişilere aktarılabilecek, devredilebilecek, sınıflandırılabilecek ve KVKK’da sayılan sair şekillerde işlenebilecektir. 6698 sayılı Kişisel Verilerin Korunması Kanunu gereğince Pronet kişisel verilerinizin güvenli bir şekilde muhafaza edilmesini ve hukuka uygun olarak işlenmesini ve erişilmesini sağlamak için bütün teknolojik ve alt yapısal imkânları kullanarak, gerekli tüm teknik ve idari tedbirleri almaktadır. Pronet size hizmet sağlayabilmek amacıyla kişisel verilerinizi aşağıdaki kuruluşlarla paylaşabilmektedir.</p>
                <ul>
                    <li>Satın aldığınız ve kullandığınız ürün ve hizmetlerin temin edilebilmesi için ilgili çözüm ortaklarımız ile,</li>
                    <li>Acil yardım çağrınız halinde konumunuzu ileteceğimiz yetkili merciler ile,</li>
                    <li>Düzenleyici ve denetleyici kurumlar ve sair resmi kurumlar, kişisel verilerinizi talep etmeye yetkili olan kamu kurum veya kuruluşları,</li>
                    <li>Sigorta firmaları, sağlık kuruluşları, finansal (banka vb.) kuruluşlar, yemek, araç kiralama, operatör şirketleri vb. ile paylaşılabilmektir.</li>
                </ul>
                <p>Kişisel verileriniz Abonelik sözleşmemiz, Pronet web sitesi, Çağrı merkezimiz aracılığı ile her türlü ürün ve hizmetlerimizin yasal çerçevede size sunulabilmesi amacıyla toplanır.</p>
                <p>Kişisel Verileri Koruma Politikamız</p>
                <p>Kişisel verileriniz kanunun belirlediği sınırlar halinde ve kanuna uygun olarak elde edilmektedir. Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu’na ve diğer kanunlarda öngörülen usul ve esaslara, aşağıdaki ilkelere uygun olarak işlenmektedir:</p>
                <ol>
                    <li>Hukuka ve dürüstlük kurallarına uygun olma ilkesine,</li>
                    <li>Belirli, açık ve meşru amaçlar için işlenme ilkesine,</li>
                    <li>İşlendikleri amaçla bağlantılı, sınırlı ve ölçülü olma ilkesine,</li>
                    <li>İlgili mevzuatta öngörülen veya işlendikleri amaç için gerekli olan süre kadar muhafaza edilme ilkesine.</li>
                </ol>
                <p>Kişisel verileriniz kanun hükümlerine uygun olarak işlenmek ile beraber, işlenmesini gerektiren sebeplerin ortadan kalkması halinde yok edilmektedir.</p>
                <p>Kişisel Verilerin Korunmasına Yönelik Haklarınız</p>
                <p>Şirketimize başvurarak,</p>
                <ul>
                    <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                    <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
                    <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                    <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
                    <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
                    <li>Kanunun 7 no’lu maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme,</li>
                    <li>Yukarıda belirtilen düzeltme, silinme ve yok edilme şeklindeki haklarınız uyarınca yapılan işlemlerin,&nbsp;kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
                    <li>İşlenen verilerin münhasıran otomatik sistemler aracılığıyla analiz edilmesi suretiyle kişinin kendisi aleyhine durumun sonucu olmasına itiraz etme</li>
                </ul>
                <p>İşlenen kişisel verilerinizin münhasıran otomatik sistemler ile analiz edilmesi sureti ile aleyhinize bir sonucun ortaya çıkması halinde veya kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğrarsanız şirketimize başvurma haklarına sahipsiniz.</p>
                <p>Kanunun uygulanmasıyla ilgili taleplerinizi ve kişisel verilerinizle ilgili her türlü sorunuzu Pronet Güvenlik Hizmetleri A.Ş. Genel Müdürlük (Otakçılar Cad. No:78 FlatOfis Eyüp İstanbul) adresine aşağıdaki başvuru formunu eksiksiz olarak doldurarak, ıslak imzalı halini TC kimlik fotokopisi ile noterde tasdik ettirip posta yolu ile ya da kayıtlı elektronik posta (KEP) adresi, güvenli elektronik imza, mobil imza ya da ilgili kişi tarafından Pronet Güvenli Hizmetleri A.Ş.’ye daha önce bildirilen ve Pronet Güvenli Hizmetleri A.Ş.’nin sisteminde kayıtlı bulunan elektronik posta adresini kullanmak suretiyle yazılı olarak iletebilirsiniz.</p>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light-primary font-weight-bold" data-dismiss="modal">Kapat</button>
            </div>
        </div>
    </div>
</div>
<script>var KTAppSettings = { "breakpoints": { "sm": 576, "md": 768, "lg": 992, "xl": 1200, "xxl": 1400 }, "colors": { "theme": { "base": { "white": "#ffffff", "primary": "#3699FF", "secondary": "#E5EAEE", "success": "#1BC5BD", "info": "#8950FC", "warning": "#FFA800", "danger": "#F64E60", "light": "#E4E6EF", "dark": "#181C32" }, "light": { "white": "#ffffff", "primary": "#E1F0FF", "secondary": "#EBEDF3", "success": "#C9F7F5", "info": "#EEE5FF", "warning": "#FFF4DE", "danger": "#FFE2E5", "light": "#F3F6F9", "dark": "#D6D6E0" }, "inverse": { "white": "#ffffff", "primary": "#ffffff", "secondary": "#3F4254", "success": "#ffffff", "info": "#ffffff", "warning": "#ffffff", "danger": "#ffffff", "light": "#464E5F", "dark": "#ffffff" } }, "gray": { "gray-100": "#F3F6F9", "gray-200": "#EBEDF3", "gray-300": "#E4E6EF", "gray-400": "#D1D3E0", "gray-500": "#B5B5C3", "gray-600": "#7E8299", "gray-700": "#5E6278", "gray-800": "#3F4254", "gray-900": "#181C32" } }, "font-family": "Poppins" };</script>
<script src="{{ asset('backend/assets/plugins/global/plugins.bundle.js') }}"></script>
<script src="{{ asset('backend/assets/plugins/custom/prismjs/prismjs.bundle.js') }}"></script>
<script src="{{ asset('backend/assets/js/scripts.bundle.js') }}"></script>
<script src="{{ asset('admin/js/jquery.mask.min.js') }}"></script>
<script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
<script src="{{ asset('admin/js/custom.js?v=1.88') }}"></script>
<script>
    $('input[name="phone"]').mask('000 000 0000');
</script>
</body>

</html>
