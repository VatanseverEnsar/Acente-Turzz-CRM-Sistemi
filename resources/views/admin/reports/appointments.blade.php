<div class="alert alert-custom alert-white alert-shadow gutter-b" role="alert">
    <div class="alert-icon">
        <span class="svg-icon svg-icon-primary svg-icon-xl">
            <!--begin::Svg Icon | path:assets/media/svg/icons/Tools/Compass.svg-->
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <rect x="0" y="0" width="24" height="24"></rect>
            <path d="M7.07744993,12.3040451 C7.72444571,13.0716094 8.54044565,13.6920474 9.46808594,14.1079953 L5,23 L4.5,18 L7.07744993,12.3040451 Z M14.5865511,14.2597864 C15.5319561,13.9019016 16.375416,13.3366121 17.0614026,12.6194459 L19.5,18 L19,23 L14.5865511,14.2597864 Z M12,3.55271368e-14 C12.8284271,3.53749572e-14 13.5,0.671572875 13.5,1.5 L13.5,4 L10.5,4 L10.5,1.5 C10.5,0.671572875 11.1715729,3.56793164e-14 12,3.55271368e-14 Z" fill="#000000" opacity="0.3"></path>
            <path d="M12,10 C13.1045695,10 14,9.1045695 14,8 C14,6.8954305 13.1045695,6 12,6 C10.8954305,6 10,6.8954305 10,8 C10,9.1045695 10.8954305,10 12,10 Z M12,13 C9.23857625,13 7,10.7614237 7,8 C7,5.23857625 9.23857625,3 12,3 C14.7614237,3 17,5.23857625 17,8 C17,10.7614237 14.7614237,13 12,13 Z" fill="#000000" fill-rule="nonzero"></path>
            </g>
            </svg>
            <!--end::Svg Icon-->
        </span>
    </div>
    <div class="alert-text">
        <p>Seçilen tarih aralığında portföy yöneticilerinin ya da yöneticilerinin randevu performansını gösterir.</p>
    </div>
</div>

<div class="card card-custom gutter-b">
    <div class="card-header flex-wrap border-0 pt-6 pb-0">
        <div class="card-title">
            <h3 class="card-label">Randevu Raporları
                <span class="d-block text-muted pt-2 font-size-sm">Sistem üzerinde ki kullanıcıların detaylı randevu raporlarını kapsar. Varsayılan olarak son 30 günlük veri alınmıştır.</span></h3>
        </div>
    </div>
    <div class="card-body">
        <form autocomplete="off" autofocus="off">
            <div class="row align-items-center">
                <div class="col-lg-12 col-xl-12">
                    <div class="form-group row align-items-center">
                        <div class="col-md-3 col-sm-6 col-3 my-2 my-md-0">
                            <div class="input-group date">
                                <input type="text" name="start_date" class="form-control datepicker" placeholder="Başlangıç Tarihi" autcomplete="off" readonly value="{!! \Request::get('start_date') !!}"/>
                                <div class="input-group-append">
                            <span class="input-group-text">
                                <i class="la la-calendar-check-o"></i>
                            </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-6 col-3 my-2 my-md-0">
                            <div class="input-group date">
                                <input type="text" name="end_date" class="form-control datepicker" placeholder="Bitiş Tarihi" autcomplete="off" readonly value="{!! \Request::get('end_date') !!}"/>
                                <div class="input-group-append">
                            <span class="input-group-text">
                                <i class="la la-calendar-check-o"></i>
                            </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-6 col-3 my-2 my-md-0">
                            <div class="d-flex align-items-center">
                                <label class="mr-3 mb-0 d-none d-md-block">Kaynak Tipi:</label>
                                <select class="form-control kt-selectpicker" name="source">
                                    <option value="">Tümü</option>
                                    @foreach( \App\Models\Sources::all() as $source )
                                        <option value="{{ $source->id }}" {!! $source->id == \Request::get('source') ? "selected":"" !!}>{{ $source->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-1 col-md-2 col-sm-2 my-2 my-md-0">
                            <button type="submit" class="btn btn-light-primary px-6 font-weight-bold">Filtrele</button>
                        </div>
                        <div class="col-lg-1 col-md-2 col-sm-2 my-2 my-md-0">
                            <a href="{!! Route('admin.reports.appointment') !!}" class="btn btn-light-danger px-6 font-weight-bold">Temizle</a>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="mb-7">
            <div class="table-responsive">
                <div class="datatable datatable-default datatable-bordered datatable-loaded">
                    <table class="table table-head-custom table-vertical-center customer_table" id="tableInit" data-action="customer">
                        <thead>
                        <tr class="text-uppercase">
                            <th style="min-width: 120px">Portföy Yöneticisi</th>
                            <th>Yeni</th>
                            <th>Yakında Sonuçlanacak</th>
                            <th>Sunum Tamamlanamadı</th>
                            <th>Satış</th>
                            <th>Red</th>
                            <th>Müşteri Yok</th>
                            <th>Ertelendi</th>
                            <th>Randevu Sayısı</th>
                            <th>Görüşme Sayısı</th>
                            <th>Görüşme Oranı</th>
                            <th>Satış Oranı</th>
                            <th>İşlemler</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach( $results as $result )
                            <tr>
                                <td class="pl-0">
                                    <span class="text-dark font-weight-bolder text-hover-primary font-size-sm">{!! $result['user']['name']!!}</span>
                                </td>
                                <td class="pl-0 text-center">
                                    <span class="text-dark font-weight-bolder text-hover-primary font-size-sm">{!! $result['appointments']['new'] !!}</span>
                                </td>
                                <td class="pl-0 text-center">
                                    <span class="text-dark font-weight-bolder text-hover-primary font-size-sm">{!! $result['appointments']['closest'] !!}</span>
                                </td>
                                <td class="pl-0 text-center">
                                    <span class="text-dark font-weight-bolder text-hover-primary font-size-sm">{!! $result['appointments']['not_completed'] !!}</span>
                                </td>
                                <td class="pl-0 text-center">
                                    <span class="text-dark font-weight-bolder text-hover-primary font-size-sm">{!! $result['appointments']['sales'] !!}</span>
                                </td>
                                <td class="pl-0 text-center">
                                    <span class="text-dark font-weight-bolder text-hover-primary font-size-sm">{!! $result['appointments']['cancelled'] !!}</span>
                                </td>
                                <td class="pl-0 text-center">
                                    <span class="text-dark font-weight-bolder text-hover-primary font-size-sm">{!! $result['appointments']['no_customer'] !!}</span>
                                </td>
                                <td class="pl-0 text-center">
                                    <span class="text-dark font-weight-bolder text-hover-primary font-size-sm">{!! $result['appointments']['delayed'] !!}</span>
                                </td>
                                <td class="pl-0 text-center">
                                    <span class="text-dark font-weight-bolder text-hover-primary font-size-sm">{!! $result['appointments']['total'] !!}</span>
                                </td>
                                <td class="pl-0 text-center">
                                    <span class="text-dark font-weight-bolder text-hover-primary font-size-sm">{!! $result['appointments']['applied'] !!}</span>
                                </td>
                                <td class="pl-0 text-center">
                                    <span class="text-dark font-weight-bolder text-hover-primary font-size-sm">{!! $result['appointments']['per_applied'] !!} %</span>
                                </td>
                                <td class="pl-0 text-center">
                                    <span class="text-dark font-weight-bolder text-hover-primary font-size-sm">{!! $result['appointments']['per_sales'] !!} %</span>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" data-id="{!! $result['user']['id']!!}" class="btn btn-icon btn-light btn-hover-primary btn-sm seeAppoinemntReport" data-toggle="tooltip" title="Grafiksel Raporu İncele">
                            <span class="svg-icon svg-icon-md svg-icon-primary">
                                <!--begin::Svg Icon | path:assets/media/svg/icons/General/Trash.svg-->
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24"/>
                                        <path d="M5,19 L20,19 C20.5522847,19 21,19.4477153 21,20 C21,20.5522847 20.5522847,21 20,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,4 C3,3.44771525 3.44771525,3 4,3 C4.55228475,3 5,3.44771525 5,4 L5,19 Z" fill="#000000" fill-rule="nonzero"/>
                                        <path d="M8.7295372,14.6839411 C8.35180695,15.0868534 7.71897114,15.1072675 7.31605887,14.7295372 C6.9131466,14.3518069 6.89273254,13.7189711 7.2704628,13.3160589 L11.0204628,9.31605887 C11.3857725,8.92639521 11.9928179,8.89260288 12.3991193,9.23931335 L15.358855,11.7649545 L19.2151172,6.88035571 C19.5573373,6.44687693 20.1861655,6.37289714 20.6196443,6.71511723 C21.0531231,7.05733733 21.1271029,7.68616551 20.7848828,8.11964429 L16.2848828,13.8196443 C15.9333973,14.2648593 15.2823707,14.3288915 14.8508807,13.9606866 L11.8268294,11.3801628 L8.7295372,14.6839411 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"/>
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

<div class="modal fade" id="seeAppoinemntReport" tabindex="-1" role="dialog" aria-labelledby="seeAppoinemntReportLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="seeAppoinemntReportLabel"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <i aria-hidden="true" class="ki ki-close"></i>
                </button>
            </div>
            <div class="modal-body">
                <div id="appointment_chart"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light-primary font-weight-bold" data-dismiss="modal">Kapat</button>
            </div>
        </div>
    </div>
</div>
{{ isset($_GET) ? $users->appends($_GET)->links() : $users->links() }}
@push('scripts')
    <script>
        var tr = {
            "name": "tr",
            "options": {
                "months": [
                    "Ocak",
                    "Şubat",
                    "Mart",
                    "Nisan",
                    "Mayıs",
                    "Haziran",
                    "Temmuz",
                    "Ağustos",
                    "Eylül",
                    "Ekim",
                    "Kasım",
                    "Aralık"
                ],
                "shortMonths": [
                    "Oca",
                    "Şub",
                    "Mar",
                    "Nis",
                    "May",
                    "Haz",
                    "Tem",
                    "Ağu",
                    "Eyl",
                    "Eki",
                    "Kas",
                    "Ara"
                ],
                "days": [
                    "Pazar",
                    "Pazartesi",
                    "Salı",
                    "Çarşamba",
                    "Perşembe",
                    "Cuma",
                    "Cumartesi"
                ],
                "shortDays": ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
                "toolbar": {
                    "exportToSVG": "SVG İndir",
                    "exportToPNG": "PNG İndir",
                    "exportToCSV": "CSV İndir",
                    "menu": "Menü",
                    "selection": "Seçim",
                    "selectionZoom": "Seçim Yakınlaştır",
                    "zoomIn": "Yakınlaştır",
                    "zoomOut": "Uzaklaştır",
                    "pan": "Kaydır",
                    "reset": "Yakınlaştırmayı Sıfırla"
                }
            }
        };
        const apexChart = "#appointment_chart";
        const primary = '#6993FF';
        const success = '#1BC5BD';
        const info = '#F39C12';
        const warning = '#FFA800';
        const danger = '#F64E60';
        const wrong = '#E74C3C';
        const appointment_count = '#ffc34d';
        const apply_count = '#0E6655';
        const apply_per = '#B03A2E';
        const sale_per = '#21618C'
        $(document).ready(function(){
            var options = {
                series:[],
                chart: {
                    locales: [tr],
                    defaultLocale: 'tr',
                    height: 350,
                    type: 'area',
                    toolbar:{
                        show:false
                    }
                },
            };

            var chart = new ApexCharts(document.querySelector(apexChart), options);
            chart.render();

            $('.seeAppoinemntReport').on('click', function(){
                chart.destroy();
                var id = $(this).attr('data-id');
                $.ajax({
                    url:'{!! Route('admin.reports.appointment.ajax') !!}',
                    type:"GET",
                    data:{
                        user_id:id,
                        start_date:$('input[name="start_date"]').val(),
                        end_date:$('input[name="end_date"]').val()
                    },
                    dataType:"json",
                    success:function(response){
                        var options = {
                            series: response.series,
                            chart: {
                                locales: [tr],
                                defaultLocale: 'tr',
                                height: 350,
                                toolbar:{
                                    show:false
                                }
                            },
                            plotOptions: {
                                bar: {
                                    horizontal: false,
                                    columnWidth: '55%',
                                    endingShape: 'rounded'
                                },
                            },
                            dataLabels: {
                                enabled: false
                            },
                            stroke: {
                                curve: 'smooth'
                            },
                            title: {
                                text: response.details.user+' Randevu Performansı ('+response.details.start_date+' - '+response.details.end_date+')',
                                align: 'center',
                            },
                            xaxis: {
                                type: 'datetime',
                                categories: response.categories
                            },
                            yaxis: [
                                {
                                    seriesName: 'Yeni',
                                    axisTicks: {
                                        show: true
                                    },
                                    axisBorder: {
                                        show: true,
                                    },
                                    title: {
                                        text: "Randevu Sayıları"
                                    },
                                    labels: {
                                        "formatter": function (val) {
                                            return val.toFixed(0)
                                        }
                                    }
                                },
                                {
                                    seriesName: 'Yeni',
                                    show: false,
                                    labels: {
                                        "formatter": function (val) {
                                            return val.toFixed(0)
                                        }
                                    }
                                },
                                {
                                    seriesName: 'Yeni',
                                    show: false,
                                    labels: {
                                        "formatter": function (val) {
                                            return val.toFixed(0)
                                        }
                                    }
                                },
                                {
                                    seriesName: 'Yeni',
                                    show: false,
                                    labels: {
                                        "formatter": function (val) {
                                            return val.toFixed(0)
                                        }
                                    }
                                },
                                {
                                    seriesName: 'Yeni',
                                    show: false,
                                    labels: {
                                        "formatter": function (val) {
                                            return val.toFixed(0)
                                        }
                                    }
                                },
                                {
                                    seriesName: 'Yeni',
                                    show: false,
                                    labels: {
                                        "formatter": function (val) {
                                            return val.toFixed(0)
                                        }
                                    }
                                },
                                {
                                    seriesName: 'Yeni',
                                    show: false,
                                    labels: {
                                        "formatter": function (val) {
                                            return val.toFixed(0)
                                        }
                                    }
                                },
                                {
                                    seriesName: 'Yeni',
                                    show: false,
                                    labels: {
                                        "formatter": function (val) {
                                            return val.toFixed(0)
                                        }
                                    }
                                },
                                {
                                    seriesName: 'Yeni',
                                    show: false,
                                    labels: {
                                        "formatter": function (val) {
                                            return val.toFixed(0)
                                        }
                                    }
                                },
                                {
                                    seriesName: 'Görüşme Oaranı',
                                    max:100,
                                    axisTicks: {
                                        show: true,
                                    },
                                    axisBorder: {
                                        show: true,
                                        color: apply_per
                                    },
                                    labels: {
                                        style: {
                                            colors: apply_per,
                                        },
                                        "formatter": function (val) {
                                            return val.toFixed(0) + '%';
                                        }
                                    },
                                    title: {
                                        text: "Görüşme Oaranı",
                                        style: {
                                            color: apply_per,
                                        }
                                    },
                                    tooltip: {
                                        enabled: true
                                    }
                                },
                                {
                                    seriesName: 'Satış Oaranı',
                                    max:100,
                                    opposite: true,
                                    axisTicks: {
                                        show: true,
                                    },
                                    axisBorder: {
                                        show: true,
                                        color: sale_per
                                    },
                                    labels: {
                                        style: {
                                            colors: sale_per,
                                        },
                                        "formatter": function (val) {
                                            return val.toFixed(0) + '%';
                                        }
                                    },
                                    title: {
                                        text: "Satış Oaranı",
                                        style: {
                                            color: sale_per,
                                        }
                                    },
                                    tooltip: {
                                        enabled: true
                                    }
                                }
                            ],
                            tooltip: {
                                x: {
                                    format: 'dd/MM/yyyy'
                                },
                            },
                            colors: [success,warning,danger,info,wrong,primary,appointment_count,apply_count,apply_per,sale_per]
                        };

                        var chart = new ApexCharts(document.querySelector(apexChart), options);
                        chart.render();
                        $('#seeAppoinemntReportLabel').text(response.details.user+' kullanıcısı için '+response.details.start_date+' ile '+response.details.end_date+' arasında ki veriler gösteriliyor.')
                        $('#seeAppoinemntReport').modal('show');
                    }
                });
            });
        });
    </script>
@endpush
