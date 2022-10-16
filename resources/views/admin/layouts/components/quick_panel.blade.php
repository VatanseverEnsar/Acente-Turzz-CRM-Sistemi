<!--begin::Quick Panel-->
<div id="kt_quick_panel" class="offcanvas offcanvas-right pt-5 pb-10">
    <!--begin::Header-->
    <div class="offcanvas-header offcanvas-header-navs d-flex align-items-center justify-content-between mb-5">
        <ul class="nav nav-bold nav-tabs nav-tabs-line nav-tabs-line-3x nav-tabs-primary flex-grow-1 px-10" role="tablist">
            <li class="nav-item">
                <a class="nav-link active" data-toggle="tab" href="#kt_quick_panel_notifications">Bildirimler</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#kt_quick_panel_settings">Ayarlar</a>
            </li>
        </ul>
        <div class="offcanvas-close mt-n1 pr-5">
            <a href="#" class="btn btn-xs btn-icon btn-light btn-hover-primary" id="kt_quick_panel_close">
                <i class="ki ki-close icon-xs text-muted"></i>
            </a>
        </div>
    </div>
    <!--end::Header-->
    <!--begin::Content-->
    <div class="offcanvas-content px-10">
        <div class="tab-content">
            
            <div class="tab-pane fade show pt-3 pr-5 mr-n5 active" id="kt_quick_panel_notifications" role="tabpanel">
                <!--begin::Nav-->
                <div class="navi navi-icon-circle navi-spacer-x-0">
                    <?php  $results = \App\Models\User::getNotifications(); ?>
                    @foreach( $results as $result )
                    <?php $className =  get_class($result); ?>
                    @if( $className == "App\Models\User" )
                    <a href="#" class="navi-item">
                        <div class="navi-link rounded">
                            <div class="symbol symbol-50 mr-3">
                                <div class="symbol-label">
                                    <i class="flaticon-users-1 text-warning icon-lg"></i>
                                </div>
                            </div>
                            <div class="navi-text">
                                <div class="font-weight-bold font-size-lg">{{ $result->name }} adında yeni bir üye kayıt oldu.</div>
                                <div class="text-muted">Kullanıcılar bölümünden profil detaylarını inceleyebilirsiniz.</div>
                            </div>
                        </div>
                    </a>
                    @endif
                    @endforeach
                </div>
                <!--end::Nav-->
            </div>
            <!--end::Tabpane-->
            <!--begin::Tabpane-->
            <div class="tab-pane fade pt-3 pr-5 mr-n5" id="kt_quick_panel_settings" role="tabpanel">
                <form class="form">
                    <!--begin::Section-->
                    <div>
                        <h5 class="font-weight-bold mb-3">Yönetici İşlemleri</h5>
                        <div class="form-group mb-0 row align-items-center">
                            <label class="col-8 col-form-label">Bildirimleri Akti Et:</label>
                            <div class="col-4 d-flex justify-content-end">
                                <span class="switch switch-success switch-sm">
                                    <label>
                                        <input type="checkbox" checked="checked" name="select" />
                                        <span></span>
                                    </label>
                                </span>
                            </div>
                        </div>
                        <div class="form-group mb-0 row align-items-center">
                            <label class="col-8 col-form-label">İstatistikleri Aktif Et:</label>
                            <div class="col-4 d-flex justify-content-end">
                                <span class="switch switch-success switch-sm">
                                    <label>
                                        <input type="checkbox" name="quick_panel_notifications_2" />
                                        <span></span>
                                    </label>
                                </span>
                            </div>
                        </div>
                        <div class="form-group mb-0 row align-items-center">
                            <label class="col-8 col-form-label">Görevlerimi Aktif Et:</label>
                            <div class="col-4 d-flex justify-content-end">
                                <span class="switch switch-success switch-sm">
                                    <label>
                                        <input type="checkbox" checked="checked" name="select" />
                                        <span></span>
                                    </label>
                                </span>
                            </div>
                        </div>
                    </div>
                    <!--end::Section-->
                    <div class="separator separator-dashed my-6"></div>
                    <!--begin::Section-->
                    <div class="pt-2">
                        <h5 class="font-weight-bold mb-3">Raporlamalar</h5>
                        <div class="form-group mb-0 row align-items-center">
                            <label class="col-8 col-form-label">Sistem Hareketlerini Aktif Et:</label>
                            <div class="col-4 d-flex justify-content-end">
                                <span class="switch switch-sm switch-danger">
                                    <label>
                                        <input type="checkbox" checked="checked" name="select" />
                                        <span></span>
                                    </label>
                                </span>
                            </div>
                        </div>
                        <div class="form-group mb-0 row align-items-center">
                            <label class="col-8 col-form-label">Sistem Loglarını Aktif Et:</label>
                            <div class="col-4 d-flex justify-content-end">
                                <span class="switch switch-sm switch-danger">
                                    <label>
                                        <input type="checkbox" name="select" />
                                        <span></span>
                                    </label>
                                </span>
                            </div>
                        </div>
                        <div class="form-group mb-0 row align-items-center">
                            <label class="col-8 col-form-label">Mesajlaşmayı Aktif Et:</label>
                            <div class="col-4 d-flex justify-content-end">
                                <span class="switch switch-sm switch-danger">
                                    <label>
                                        <input type="checkbox" checked="checked" name="select" />
                                        <span></span>
                                    </label>
                                </span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <!--end::Tabpane-->
        </div>
    </div>
    <!--end::Content-->
</div>
<!--end::Quick Panel-->