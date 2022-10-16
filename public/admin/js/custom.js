function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
var Adminurl = location.origin;
let translate = {
    records: {
        processing: 'Lütfen bekleyiniz...',
        noRecords: 'Herhangi bir sonuç bulunamadı.',
    },
    toolbar: {
        pagination: {
            items: {
                default: {
                    first: 'İlk',
                    prev: 'Önceki',
                    next: 'Sonraki',
                    last: 'Son',
                    more: 'Daha fazla',
                    input: 'Sayfa Numarası',
                    select: 'Sayfa başına gösterilecek kayıt',
                },
                info: 'Toplam {{total}} kayıttan {{start}} ile {{end}} arası gösteriliyor',
            },
        },
    },
};


var UserDataTable = function () {
    var userOptions = {
        // datasource definition
        data: {
            type: 'remote',
            source: {
                read: {
                    // sample GET method
                    method: 'GET',
                    url: 'get_all_users',
                    map: function (raw) {
                        // sample data mapping
                        var dataSet = raw;
                        if (typeof raw.data !== 'undefined') {
                            dataSet = raw.data;
                        }
                        return dataSet;
                    },
                },
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
        },

        // layout definition
        layout: {
            scroll: false,
            footer: false
        },

        // column sorting
        sortable: true,
        translate: translate,
        pagination: true,

        toolbar: {
            // toolbar items
            items: {
                // pagination
                pagination: {
                    // page size select
                    pageSizeSelect: [10, 20, 30, 50, 100],
                },
            },
        },

        search: {
            input: $('#generalSearch'),
        },

        // columns definition
        columns: [
            {
                field: 'user_id',
                title: '#',
                sortable: false, // disable sort for this column
                width: 40,
                selector: {class: ''},
                textAlign: 'center',
            }, {
                field: 'id',
                title: 'ID',
                width: 40,
                textAlign: 'center',
                template: function (row) {
                    return '#' + row.id;
                }
            }, {
                field: 'name',
                title: 'Adı Soyadı',

                filterable: false, // disable or enable filtering
                width: 150,
                // basic templating support for column rendering,
                template: '{{name}}',
            }, {
                field: 'Email',
                title: 'E-Posta Adresi',
                template: '{{email}}',
            }, {
                field: 'Role',
                title: 'Kullanıcı Rolü',
                width: 150,
                sortable: false,
                // callback function support for column rendering
                template: function (row) {
                    var status = {
                        1: {'class': 'label-light-danger'},
                        2: {'class': 'label-light-primary'},
                        8: {'class': 'label-light-info'},
                        9: {'class': 'label-light-warning'},
                        10: {'class': 'label-light-success'},
                        11: {'class': 'label-light-gray'},
                        7: {'class': 'label-light-black'},
                    };
                    return '<span class="label font-weight-bold label-lg ' + status[row.role_id].class + 'label-inline">' + row.roles_name + '</span>';
                }
            }, {
                field: 'Phone',
                title: 'Telefon',
                sortable: false,
                // callback function support for column rendering
                template: function (row) {
                    return row.phone == null ? "Belirtilmemiş" : row.phone;
                }
            }, {
                field: 'Status',
                title: 'Durum',
                sortable: false,
                // callback function support for column rendering
                template: function (row) {
                    return '<span class="label label-' + (row.email_verified_at == null ? "danger" : "success") + ' label-dot mr-2"></span><span class="font-weight-bold text-' + (row.email_verified_at == null ? "danger" : "success") + '">' + (row.email_verified_at == null ? "Bekleyen" : "Onaylanmış") + '</span>';
                },
            }, {
                field: 'created_at',
                title: 'Kayıt Tarihi',
                sortable: 'desc',
                // callback function support for column rendering
                template: function (row) {
                    var date = new Date(row.created_at);
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var hours = addZero(date.getHours());
                    var minutes = addZero(date.getMinutes());
                    switch (month) {
                        case 1:
                            month = "Ocak";
                            break;
                        case 2:
                            month = "Şubat";
                            break;
                        case 3:
                            month = "Mart";
                            break;
                        case 4:
                            month = "Nisan";
                            break;
                        case 5:
                            month = "Mayıs";
                            break;
                        case 6:
                            month = "Haziran";
                            break;
                        case 7:
                            month = "Temmuz";
                            break;
                        case 8:
                            month = "Ağustos";
                            break;
                        case 9:
                            month = "Eylül";
                            break;
                        case 10:
                            month = "Ekim";
                            break;
                        case 11:
                            month = "Kasım";
                            break;
                        case 12:
                            month = "Aralık";
                            break;
                    }
                    return day + " " + month + ", " + year + " " + hours + ":" + minutes;
                }
            }, {
                field: 'Actions',
                width: 200,
                title: 'İşlemler',
                sortable: false,

                template: function (row, index, datatable) {
                    var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
                    var applyUser = row.email_verified_at == null ? 'applyUser' : 'd-none';
                    return '\
                             <a href="javascript:void(0)" class="btn btn-sm btn-clean btn-icon mr-2 ' + applyUser + '" data-id="' + row.id + '" title="Kullanıcı Hesabı Onayla" data-toggle="tooltip">\
							<span class="svg-icon svg-icon-md svg-icon-info">\
                                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
                                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
                                                                    <mask fill="white"> <use xlink:href="#path-1"/> </mask>\
                                                                    <path d="M7,10 L7,8 C7,5.23857625 9.23857625,3 12,3 C14.7614237,3 17,5.23857625 17,8 L17,10 L18,10 C19.1045695,10 20,10.8954305 20,12 L20,18 C20,19.1045695 19.1045695,20 18,20 L6,20 C4.8954305,20 4,19.1045695 4,18 L4,12 C4,10.8954305 4.8954305,10 6,10 L7,10 Z M12,5 C10.3431458,5 9,6.34314575 9,8 L9,10 L15,10 L15,8 C15,6.34314575 13.6568542,5 12,5 Z" fill="#000000"/>\
                                                                </g>\
                                                            </svg>\
                                                        </span>\
						</a>\
						<a href="/user-edit/' + row.id + '" class="btn btn-sm btn-clean btn-icon mr-2" title="Kullanıcı Düzenle" data-toggle="tooltip">\
							<span class="svg-icon svg-icon-md svg-icon-warning">\
                                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
                                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
                                                                    <rect x="0" y="0" width="24" height="24"/>\
                                                                    <path d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z" fill="#000000" fill-rule="nonzero"\ transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) "/>\
                                                                    <rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"/>\
                                                                </g>\
                                                            </svg>\
                                                        </span>\
						</a>\
						<a href="javascript:void(0)" data-id="' + row.id + '" class="btn btn-sm btn-clean btn-icon delUser" title="Sil">\
							<span class="svg-icon svg-icon-md svg-icon-danger">\
                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
                                                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
                                                                <rect x="0" y="0" width="24" height="24"/>\
                                                                <path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"/>\
                                                                <path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"/>\
                                                            </g>\
                                                        </svg>\
                                                    </span>\
						</a>\
					';
                },
            }],
    };
    var UserTable = function () {
        userOptions.extensions = {
            // boolean or object (extension options)
            checkbox: true,
        };
        userOptions.search = {
            input: $('#kt_datatable_search_query'),
            key: 'generalSearch'
        };
        var datatable = $('#user_datatable').KTDatatable(userOptions);

        $('#kt_datatable_search_status').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Status');
        });

        $('#kt_datatable_search_type').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Type');
        });

        $('#kt_datatable_search_status, #kt_datatable_search_type').selectpicker();

        datatable.on(
            'datatable-on-click-checkbox',
            function (e) {
                // datatable.checkbox() access to extension methods
                var ids = datatable.checkbox().getSelectedId();
                var count = ids.length;

                $('#user_datatable_selected_records').html(count);

                if (count > 0) {
                    $('#user_datatable_group_action').collapse('show');
                } else {
                    $('#user_datatable_group_action').collapse('hide');
                }
            });
        $('#kt_datatable_fetch_modal_2').on('show.bs.modal', function (e) {
            var ids = datatable.checkbox().getSelectedId();
            var c = document.createDocumentFragment();
            for (var i = 0; i < ids.length; i++) {
                var li = document.createElement('li');
                li.setAttribute('data-id', ids[i]);
                li.innerHTML = 'Selected record ID: ' + ids[i];
                c.appendChild(li);
            }
            $('#kt_datatable_fetch_display_2').append(c);
        }).on('hide.bs.modal', function (e) {
            $('#kt_datatable_fetch_display_2').empty();
        });

    };

    return {
        // public functions
        init: function () {
            UserTable();
        },
    };
}();


var _initAdvancedTableGroupSelection = function(element) {
    var table = KTUtil.getById(element);

    if (!table) {
        return;
    }

    KTUtil.on(table, 'thead th .checkbox > input', 'change', function (e) {
        var checkboxes = KTUtil.findAll(table, 'tbody td .checkbox > input');

        for (var i = 0, len = checkboxes.length; i < len; i++) {
            checkboxes[i].checked = this.checked;
        }
    });
}

var _initChartsWidget6 = function (result) {
    var element = document.getElementById("kt_charts_widget_6_chart");

    if (!element) {
        return;
    }

    var options = {
        series: result.charts,
        chart: {
            stacked: true,
            height: 350,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                stacked: true,
                horizontal: false,
                endingShape: 'rounded',
                columnWidth: ['12%']
            },
        },
        legend: {
            show: false
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: result.categories,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false
            },
            labels: {
                style: {
                    colors: KTApp.getSettings()['colors']['gray']['gray-500'],
                    fontSize: '12px',
                    fontFamily: KTApp.getSettings()['font-family']
                }
            }
        },
        yaxis: {
            max: 20,
            labels: {
                style: {
                    colors: KTApp.getSettings()['colors']['gray']['gray-500'],
                    fontSize: '12px',
                    fontFamily: KTApp.getSettings()['font-family']
                }
            }
        },
        fill: {
            opacity: 1
        },
        states: {
            normal: {
                filter: {
                    type: 'none',
                    value: 0
                }
            },
            hover: {
                filter: {
                    type: 'none',
                    value: 0
                }
            },
            active: {
                allowMultipleDataPointsSelection: false,
                filter: {
                    type: 'none',
                    value: 0
                }
            }
        },
        tooltip: {
            style: {
                fontSize: '12px',
                fontFamily: KTApp.getSettings()['font-family']
            },
            y: {
                formatter: function (val) {
                    return val;
                }
            }
        },
        colors: [KTApp.getSettings()['colors']['theme']['base']['info'], KTApp.getSettings()['colors']['theme']['base']['primary'], KTApp.getSettings()['colors']['theme']['light']['primary']],
        grid: {
            borderColor: KTApp.getSettings()['colors']['gray']['gray-200'],
            strokeDashArray: 4,
            yaxis: {
                lines: {
                    show: true
                }
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        }
    };

    var chart = new ApexCharts(element, options);
    chart.render();
}

var KTProfile = function () {
    // Elements
    var avatar;
    var offcanvas;

    // Private functions
    var _initAside = function () {
        // Mobile offcanvas for mobile mode
        offcanvas = new KTOffcanvas('kt_profile_aside', {
            overlay: true,
            baseClass: 'offcanvas-mobile',
            //closeBy: 'kt_user_profile_aside_close',
            toggleBy: 'kt_subheader_mobile_toggle'
        });
    }

    var _initForm = function () {
        avatar = new KTImageInput('kt_profile_avatar');
    }

    return {
        // public functions
        init: function () {
            _initAside();
            _initForm();
        }
    };
}();

var KTClipboardDemo = function () {
    var demos = function () {
        new ClipboardJS('[data-clipboard=true]').on('success', function (e) {
            e.clearSelection();
            alert('Kopyalandı!');
        });
    }

    return {
        // public functions
        init: function () {
            demos();
        }
    };
}();

$(document).ready(function () {
    $('[data-switch=true]').bootstrapSwitch();
    _initAdvancedTableGroupSelection('tableInit');
    var swiper = new Swiper('.swiper-container', {
        spaceBetween: 30,
        effect: 'fade',
        pagination: {
            el: '.swiper-pagination',
        },
        navigation:false
    });

    if ($('#kt_charts_widget_6_chart').length > 0) {
        $.ajax({
            url: location.origin + '/admin/statics',
            method: "GET",
            dataType: "json",
            success: function (result) {
                _initChartsWidget6(result);
            }
        });
    }
    if ($('#kt_subheader_mobile_toggle').length > 0) {
        KTProfile.init();
    }

    if ($('#m_clipboard_1').length > 0) {
        KTClipboardDemo.init();
    }


    if ($('#user_datatable').length > 0) {
        UserDataTable.init();
    }

    $(document).on('change', 'select[name="city"]',function(){
        var city_id = $(this).val();
        $.ajax({
            url:location.origin+'/get-town',
            method:'GET',
            data:{
                city_id:city_id
            },
            dataType:'json',
            success:function(result){
                $('select[name="district"]').html("");
                $('select[name="town"]').html("");
                for( var i = 0; i < result.length; i++ ){
                    $('select[name="district"]').append('<option value="'+result[i].TownID+'">'+result[i].TownName+'</option>');
                }
                for( var i = 0; i < result.length; i++ ){
                    $('select[name="town"]').append('<option value="'+result[i].TownID+'">'+result[i].TownName+'</option>');
                }
            }
        });
    });

    $(document).on('change', 'select[name="city_two"]',function(){
        var city_id = $(this).val();
        $.ajax({
            url:location.origin+'/get-town',
            method:'GET',
            data:{
                city_id:city_id
            },
            dataType:'json',
            success:function(result){
                $('select[name="town_two"]').html("");
                for( var i = 0; i < result.length; i++ ){
                    $('select[name="town_two"]').append('<option value="'+result[i].TownID+'">'+result[i].TownName+'</option>');
                }
            }
        });
    });

    $(document).on('change', '#city_id',function(){
        var city_id = $(this).val();
        $.ajax({
            url:location.origin+'/get-town',
            method:'GET',
            data:{
                city_id:city_id
            },
            dataType:'json',
            success:function(result){
                $('select[name="town"]').html("");
                $('select[name="town"]').append('<option value="">Tümü</option>');
                for( var i = 0; i < result.length; i++ ){
                    $('select[name="town"]').append('<option value="'+result[i].TownID+'">'+result[i].TownName+'</option>');
                }
            }
        });
    });

    /* Müşteri Not Gönderme Eventi */
    $('form.SendNote').on('submit', function(event) {
        event.preventDefault();
        var customer_id = $('input[name="note_customer_id"]').attr('data-id');
        var message = $('textarea[name="notes"]').val();
        $.ajax({
            url:location.origin+'/notes/add',
            method:'GET',
            data:{
                customer_id:customer_id,
                message:message
            },
            dataType:'json',
            success:function(response){
                if( response.status == 1 ){
                    triggerToastrSuccess(response.msg);
                    $('#notesModal').modal('hide');
                    setTimeout(function(){
                        location.reload();
                    },2000);
                }
            }
        });
        return false;
    });

    /* Yeni Kullanıcı Rol Ekleme Eventi */
    $('form.SendRole').on('submit', function(event) {
        event.preventDefault();
        var slug = $('input[name="slug"]').val();
        var name = $('input[name="name"]').val();
        var description = $('input[name="description"]').val();
        $.ajax({
            url:location.origin+'/user-roles/add',
            method:'GET',
            data:{
                slug:slug,
                name:name,
                description:description
            },
            dataType:'json',
            success:function(response){
                if( response.status == 1 ){
                    triggerToastrSuccess(response.msg);
                    $('#roleModal').modal('hide');
                    setTimeout(function(){
                        location.reload();
                    },1000);
                }
            }
        });
        return false;
    });

    $('.viewAddress').on('click', function(){
        var id = $(this).attr('data-id');
        $('#addressViewModal .modal-body').html("");
        $.ajax({
            url:location.origin+'/view-address/'+id,
            type:"GET",
            dataType:"json",
            success:function(result){
                if( result.status == 1 ){
                    $('#addressViewModal .modal-body').append(result.render);
                    $('#addressViewModal').modal('show');
                }
            }
        });
    });

    $('.openContentModal').on('click', function(){
        var id = $(this).attr('data-id');
        $('input[name="posts_id"]').val(id);
        $('#contentModal').modal('show');
    });

    /* Tur Tipi Ekleme Eventi */
    $('form.TourType').on('submit', function(event) {
        event.preventDefault();
        var tour_type = $('input[name="tour_type"]').val();
        $.ajax({
            url:location.origin+'/tour-type/add',
            method:'POST',
            data:{
                tour_type:tour_type,
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataType:'json',
            success:function(response){
                if( response.status == 1 ){
                    triggerToastrSuccess(response.msg);
                    $('#tourTypeModal').modal('hide');
                    setTimeout(function(){
                        location.reload();
                    },2000);
                }
            },
            error:function (response){
                var errors = response.responseJSON.errors;
                for( var key in errors ){
                    $('#'+key).append('<div class="invalid-feedback">Bu alan zorunludur</div>');
                }
            }
        });
        return false;
    });

    /* Müşteri Adres Ekleme Eventi */
    $('form.SendAdress').on('submit', function(event) {
        event.preventDefault();
        var customer_id = $('input[name="customers_id"]').val();
        var name = $('input[name="name"]').val();
        var quarter = $('input[name="quarter"]').val();
        var content = $('input[name="neighborhood"]').val();
        var street = $('input[name="street"]').val();
        var apartment_no = $('input[name="apartment_no"]').val();
        var door_no = $('input[name="door_no"]').val();
        var city = $('#city select[name="city"]').val();
        var town = $('select[name="town"]').val();
        var address_note = $('#address_note').val();

        $.ajax({
            url:location.origin+'/adress/add',
            method:'POST',
            data:{
                customer_id:customer_id,
                name:name,
                quarter:quarter,
                street:street,
                neighborhood:neighborhood,
                apartment_no:apartment_no,
                door_no:door_no,
                city:city,
                town:town,
                address_note:address_note
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataType:'json',
            success:function(response){
                if( response.status == 1 ){
                    triggerToastrSuccess(response.msg);
                    $('#adressModal').modal('hide');
                    setTimeout(function(){
                        location.reload();
                    },2000);
                }
            },
            error:function (response){
                var errors = response.responseJSON.errors;
                for( var key in errors ){
                    $('#'+key).append('<div class="invalid-feedback">Bu alan zorunludur</div>');
                }
            }
        });
        return false;
    });

    $(document).on('click', 'a.delUser', function () {
        var user_id = $(this).attr('data-id');
        Swal.fire({
            title: 'Emin misiniz?',
            html: "Bu kullanıcı hesabını kalıcı olarak siliyorsunuz. Bu işlemi onaylıyor musunuz?</br><span class='text-danger'>Kullanıcı tarafından oluşturulmuş tüm kayıtların aktarılacağı kullanıcıyı aşağıdan seçiniz.</span> ",
            type: 'warning',
            input: 'select',
            inputOptions:window.users,
            inputPlaceholder: 'Lütfen kullanıcı seçiniz.',
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value) {
                        $.ajax({
                            url: Adminurl + "/delete-user",
                            type: "GET",
                            data: {
                                user_id: user_id,
                                update_user_id:value,
                            },
                            dataType: "json",
                            success: function (result) {
                                if (result.status == 1) {
                                    Swal.fire(
                                        'İşlem Tamamlandı!',
                                        result.msg,
                                        'success'
                                    ).then(function (result) {
                                        if (result.value) {
                                            window.location.reload();
                                        }
                                    });
                                } else {
                                    Swal.fire('Hata!', result.msg, 'error');
                                }
                            }
                        });
                    } else {
                        resolve('Lütfen bir kullanıcı seçiniz :)')
                    }
                })
            },
            showCancelButton: true,
            confirmButtonText: 'Evet! Onaylıyorum',
            cancelButtonText: "Vazgeç",
        });
    });

    $(document).on('click', 'a.applyUser, button.applyUser', function () {
        var user_id = $(this).attr('data-id');
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu kullanıcı hesabını manuel olarak aktif etmek istiyorsunuz. Bu işlemi onaylıyor musunuz?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet! Onaylıyorum',
            cancelButtonText: "Vazgeç",
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: Adminurl + "/apply_user",
                    type: "GET",
                    data: {
                        user_id: user_id
                    },
                    dataType: "json",
                    success: function (result) {
                        if (result.status == 1) {
                            Swal.fire(
                                'İşlem Tamamlandı!',
                                result.msg,
                                'success'
                            ).then(function (result) {
                                if (result.value) {
                                    window.location.reload();
                                }
                            });
                        } else {
                            Swal.fire(
                                'Hata!',
                                result.msg,
                                'warning'
                            )
                        }
                    }
                });

            }
        });
    });

    $(document).on('click', 'a.delCustomer', function () {
        var customer_id = $(this).attr('data-id');
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu müşteriyi kalıcı olarak siliyorsunuz. Müşteriye ait tüm veriler kalıcı olarak silinecektir. İşlemi onaylıyor musunuz?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet! Onaylıyorum',
            cancelButtonText: "Vazgeç",
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: Adminurl + "/delete-customer",
                    type: "GET",
                    data: {
                        customer_id: customer_id
                    },
                    dataType: "json",
                    success: function (result) {
                        if (result.status == 1) {
                            Swal.fire(
                                'İşlem Tamamlandı!',
                                result.msg,
                                'success'
                            ).then(function (result) {
                                if (result.value) {
                                    window.location.reload();
                                }
                            });
                        } else {
                            Swal.fire('Hata!', result.msg, 'error');
                        }
                    }
                });

            }
        });
    });

    $(document).on('click', 'a.delTourType', function () {
        var type_id = $(this).attr('data-id');
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu tur tipini kalıcı olarak siliyorsunuz.İşlemi onaylıyor musunuz?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet! Onaylıyorum',
            cancelButtonText: "Vazgeç",
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: Adminurl + "/delete-tour-type",
                    type: "GET",
                    data: {
                        type_id: type_id
                    },
                    dataType: "json",
                    success: function (result) {
                        if (result.status == 1) {
                            Swal.fire(
                                'İşlem Tamamlandı!',
                                result.msg,
                                'success'
                            ).then(function (result) {
                                if (result.value) {
                                    window.location.reload();
                                }
                            });
                        } else {
                            Swal.fire('Hata!', result.msg, 'error');
                        }
                    }
                });

            }
        });
    });
    $(document).on('click', 'a.delAcente', function () {
        var acente_id = $(this).attr('data-id');
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu acente kayıtını kalıcı olarak siliyorsunuz.İşlemi onaylıyor musunuz?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet! Onaylıyorum',
            cancelButtonText: "Vazgeç",
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: Adminurl + "/delete-acente",
                    type: "GET",
                    data: {
                        acente_id: acente_id
                    },
                    dataType: "json",
                    success: function (result) {
                        if (result.status == 1) {
                            Swal.fire(
                                'İşlem Tamamlandı!',
                                result.msg,
                                'success'
                            ).then(function (result) {
                                if (result.value) {
                                    window.location.reload();
                                }
                            });
                        } else {
                            Swal.fire('Hata!', result.msg, 'error');
                        }
                    }
                });

            }
        });
    });

    $(document).on('click', 'a.delContract', function () {
        var contract_id = $(this).attr('data-id');
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu sözleşme kayıtını kalıcı olarak siliyorsunuz.İşlemi onaylıyor musunuz?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet! Onaylıyorum',
            cancelButtonText: "Vazgeç",
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: Adminurl + "/delete-contract",
                    type: "GET",
                    data: {
                        id: contract_id
                    },
                    dataType: "json",
                    success: function (result) {
                        if (result.status == 1) {
                            Swal.fire(
                                'İşlem Tamamlandı!',
                                result.msg,
                                'success'
                            ).then(function (result) {
                                if (result.value) {
                                    window.location.reload();
                                }
                            });
                        } else {
                            Swal.fire('Hata!', result.msg, 'error');
                        }
                    }
                });

            }
        });
    });

    $(document).on('click', 'a.delBids', function () {
        var bids_id = $(this).attr('data-id');
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu teklif kayıtı ve teklife ait sözleşmeler kalıcı olarak silinecektir. İşlemi onaylıyor musunuz?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet! Onaylıyorum',
            cancelButtonText: "Vazgeç",
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: Adminurl + "/delete-bids",
                    type: "GET",
                    data: {
                        bids_id: bids_id
                    },
                    dataType: "json",
                    success: function (result) {
                        if (result.status == 1) {
                            Swal.fire(
                                'İşlem Tamamlandı!',
                                result.msg,
                                'success'
                            ).then(function (result) {
                                if (result.value) {
                                    window.location.reload();
                                }
                            });
                        } else {
                            Swal.fire('Hata!', result.msg, 'error');
                        }
                    }
                });

            }
        });
    });


    $(document).on('click', 'a.delTours', function () {
        var id = $(this).attr('data-id');
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu tur kayıtını kalıcı olarak siliyorsunuz.İşlemi onaylıyor musunuz?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet! Onaylıyorum',
            cancelButtonText: "Vazgeç",
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: Adminurl + "/delete-tours",
                    type: "GET",
                    data: {
                        id: id
                    },
                    dataType: "json",
                    success: function (result) {
                        if (result.status == 1) {
                            Swal.fire(
                                'İşlem Tamamlandı!',
                                result.msg,
                                'success'
                            ).then(function (result) {
                                if (result.value) {
                                    window.location.reload();
                                }
                            });
                        } else {
                            Swal.fire('Hata!', result.msg, 'error');
                        }
                    }
                });

            }
        });
    });

    $(document).on('click', 'a.seeReminderNote', function(){
        var id = $(this).attr('data-id');
        $.ajax({
            url: Adminurl + "/show-reminder-subject",
            method:"GET",
            data:{id:id},
            dataType:"json",
            success:function(response){
                $('span.reminderModalId').text(id);
                $('#showReminderNote .modal-body').html('<p>'+response.subject+'</p>');
                $('#showReminderNote').modal('show');
            }
        });
    });

    $(document).on('click', 'a.delReminder', function () {
        var id = $(this).attr('data-id');
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu hatırlatma kayıtını kalıcı olarak siliyorsunuz.İşlemi onaylıyor musunuz?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet! Onaylıyorum',
            cancelButtonText: "Vazgeç",
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: Adminurl + "/delete-reminder",
                    type: "GET",
                    data: {
                        id: id
                    },
                    dataType: "json",
                    success: function (result) {
                        if (result.status == 1) {
                            Swal.fire(
                                'İşlem Tamamlandı!',
                                result.msg,
                                'success'
                            ).then(function (result) {
                                if (result.value) {
                                    window.location.reload();
                                }
                            });
                        } else {
                            Swal.fire('Hata!', result.msg, 'error');
                        }
                    }
                });

            }
        });
    });

    $(document).on('click', 'a.updateStatus', function () {
        var tour_id = $(this).attr('data-id');
        var s = $(this).attr('data-status');
        var status = {
            1: {
                'title': 'Aktif',
                'class': ' text-info'
            },
            2: {
                'title': 'Pasif',
                'class': ' text-warning'
            }
        };
        Swal.fire({
            title: 'Emin misiniz?',
            html: "Seçilen turun durumu <span class='font-weight-bold " + status[s].class + "'>" + status[s].title + "</span> olarak güncellenecektir. Bu işlemi onaylıyor musunuz?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet! Onaylıyorum',
            cancelButtonText: "Vazgeç",
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: Adminurl + "/update-tour-status",
                    type: "GET",
                    data: {
                        status: s,
                        tour_id: tour_id
                    },
                    dataType: "json",
                    success: function (result) {
                        if (result.status == 1) {
                            Swal.fire(
                                'İşlem Tamamlandı',
                                result.msg,
                                'success'
                            ).then(function (result) {
                                if (result.value) {
                                    window.location.reload();
                                }
                            });
                        } else {
                            Swal.fire('Hata!', result.msg, 'error');
                        }
                    }
                });

            }
        });
    });

    $(document).on('click', 'a.updateStatusBid', function () {
        var bid_id = $(this).attr('data-id');
        var s = $(this).attr('data-status');
        var status = {
            1: {
                'title': 'Kabul',
                'class': ' text-success'
            },
            2: {
                'title': 'Red',
                'class': ' text-danger'
            }
        };
        Swal.fire({
            title: 'Emin misiniz?',
            html: "Seçilen teklifin durumu <span class='font-weight-bold " + status[s].class + "'>" + status[s].title + "</span> olarak güncellenecektir. Bu işlemi onaylıyor musunuz?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet! Onaylıyorum',
            cancelButtonText: "Vazgeç",
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: Adminurl + "/update-bid-status",
                    type: "GET",
                    data: {
                        status: s,
                        bid_id: bid_id
                    },
                    dataType: "json",
                    success: function (result) {
                        if (result.status == 1) {
                            Swal.fire(
                                'İşlem Tamamlandı',
                                result.msg,
                                'success'
                            ).then(function (result) {
                                if (result.value) {
                                    window.location.reload();
                                }
                            });
                        } else {
                            Swal.fire('Hata!', result.msg, 'error');
                        }
                    }
                });

            }
        });
    });

    $(document).on('click', 'a.bidToContract', function () {
        var href = $(this).attr('data-href');
        Swal.fire({
            title: 'Emin misiniz?',
            html: "Seçilen teklif için yeni sözleşme oluşturulacaktır. Bu işlemi onaylıyor musunuz?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet! Onaylıyorum',
            cancelButtonText: "Vazgeç",
        }).then(function (result) {
            if (result.value) {
                window.location.href = href;
            }
        });
    });

    $(document).on('click', 'a.delPackage', function () {
        var package_id = $(this).attr('data-id');
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu paketi kalıcı olarak siliyorsunuz.İşlemi onaylıyor musunuz?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet! Onaylıyorum',
            cancelButtonText: "Vazgeç",
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: Adminurl + "/delete-package",
                    type: "GET",
                    data: {
                        package_id: package_id
                    },
                    dataType: "json",
                    success: function (result) {
                        if (result.status == 1) {
                            Swal.fire(
                                'İşlem Tamamlandı!',
                                result.msg,
                                'success'
                            ).then(function (result) {
                                if (result.value) {
                                    window.location.reload();
                                }
                            });
                        } else {
                            Swal.fire('Hata!', result.msg, 'error');
                        }
                    }
                });

            }
        });
    });

    $(document).on('click', 'button.deletePlace', function () {
        var place_id = $(this).attr('data-id');
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu mekanı işlem yapılan teklif için kalıcı olarak siliyorsunuz. İşlemi onaylıyor musunuz?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet! Onaylıyorum',
            cancelButtonText: "Vazgeç",
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: Adminurl + "/delete-place",
                    type: "GET",
                    data: {
                        place_id: place_id
                    },
                    dataType: "json",
                    success: function (result) {
                        if (result.status == 1) {
                            Swal.fire(
                                'İşlem Tamamlandı!',
                                result.msg,
                                'success'
                            ).then(function (result) {
                                if (result.value) {
                                    window.location.reload();
                                }
                            });
                        } else {
                            Swal.fire('Hata!', result.msg, 'error');
                        }
                    }
                });

            }
        });
    });

    $('#kt_aside_toggle').on('click', function(e){
        var type = $(this).attr('data-status');
        var el = $(this);
        type = type == 1 ? 0 : 1;
        $.ajax({
            url:location.origin+'/change-panel-type',
            method:'GET',
            data:{
               panel_type:type
            },
            success:function (res) {
                el.attr('data-status', type);
            }
        });
    });

    $('#source-type').on('change', function(){
        $('.dependSource').addClass('d-none');
        var element = $(this);
        var val = $(this).val();

        if( val == "" || val == "undefined" ){
            return false;
        }
        if( val == 1 ) {
            $('.SourceRefences').removeClass('d-none');
            select2Refence();
        }

        if( val == 2 ){
            $('.SourceLead').removeClass('d-none');
        }
        if( val == 5 ){
            $('.SourceKartvizit').removeClass('d-none');
        }
        if( val == 6 ){
            $('.SourceUser').removeClass('d-none');
        }
    });


    $('select[name="call_type"]').on('change', function(){
        $('.DependsCallType').addClass('d-none');
        $('.dependsCallTypeSell').addClass('d-none');
        $('select[name="call_sell_result"]').val("");
        $('select[name="call_complain_result"]').val("");
        if( $(this).val() == 1 ){
            $('.CallTypeSell').removeClass('d-none');
        }
        if( $(this).val() == 2 ){
            $('.CallTypeComplain').removeClass('d-none');
        }
    });

    $('select[name="check-up-type"]').on('change', function(){
        $('.dependCheckUp').addClass('d-none');
        if( $(this).val() == 1 ){
            $('.CheckUpWork').removeClass('d-none');
        }
    });

    $('select[name="call_sell_result"]').on('change', function(){
        $('.dependsCallTypeSell').addClass('d-none');
        if( $(this).val() == 2 ){
            $('.dependsCallTypeSell').removeClass('d-none');
        }
    });

    $('select[name="status"]').on('change', function(){
        $('.dependsStatusID, .dependsStatusCall').addClass('d-none');
        if( $(this).val() == 5 ){
            $('.dependsStatusID').removeClass('d-none');
        }
        if( $(this).val() != 0 ){
            $('.dependsStatusCall').removeClass('d-none');
        }
    });

    $('select[name="contract_status"]').on('change', function(){
        $('.dependsContractStatus').addClass('d-none');
        $('.dependsContractStatus  input').each(function(){
            $(this).prop('disabled', true);
        });
        if( $(this).val() == 4 || $(this).val() == 5 ){
            $('.dependsContractStatus.contractStatusProgram input').each(function(){
               $(this).prop('disabled', false);
            });
            $('.dependsContractStatus.contractStatusProgram').removeClass('d-none');
        }
        if( $(this).val() == 3 ){
            $('.dependsContractStatus.contractStatusProblem input').each(function(){
                $(this).prop('disabled', false);
            });
            $('.dependsContractStatus.contractStatusProblem').removeClass('d-none');
        }
        if( $(this).val() == 6 ){
            $('.dependsContractStatus.contractStatusCancel input').each(function(){
                $(this).prop('disabled', false);
            });
            $('.dependsContractStatus.contractStatusCancel').removeClass('d-none');
        }
    });

    $('select[name="appointment_result"]').on('change', function(){
        $('.DependsAppointmentResult').addClass('d-none');
        $('.DependsYakindaSonuclanacak').addClass('d-none');
        $('.DependsRefuseResult').addClass('d-none');
        if( $(this).val() == 7 ){
            $('.DependsAppointmentResult').removeClass('d-none');
        }
        if( $(this).val() == 2 ){
            $('.DependsYakindaSonuclanacak').removeClass('d-none');
        }
        if( $(this).val() == 5 ){
            $('.DependsRefuseResult').removeClass('d-none');
        }

    });

    $('button.givePermissionToRole').on('click', function (event) {
        var role_id = $(this).attr('data-id');
        var permission_id = $(this).attr('data-perid');
        $.ajax({
            url: location.origin + "/give-permission-role",
            type: "GET",
            data: {
                role_id: role_id,
                permission_id: permission_id,
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            dataType: "json",
            success: function (result) {
                if (result.status == 1) {
                    toastr.options = {
                        "closeButton": false,
                        "debug": false,
                        "newestOnTop": false,
                        "progressBar": false,
                        "positionClass": "toast-top-right",
                        "preventDuplicates": false,
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "5000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    };

                    toastr.success(result.msg);
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                } else {
                    toastr.options = {
                        "closeButton": false,
                        "debug": false,
                        "newestOnTop": false,
                        "progressBar": false,
                        "positionClass": "toast-top-right",
                        "preventDuplicates": false,
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "5000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    };

                    toastr.error(result.msg);
                }
            }
        });
    });

    $('button.takePermissionFromRole').on('click', function (event) {
        var role_id = $(this).attr('data-id');
        var permission_id = $(this).attr('data-perid');
        $.ajax({
            url: location.origin + "/take-permission-role",
            type: "GET",
            data: {
                role_id: role_id,
                permission_id: permission_id,
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            dataType: "json",
            success: function (result) {
                if (result.status == 1) {
                    toastr.options = {
                        "closeButton": false,
                        "debug": false,
                        "newestOnTop": false,
                        "progressBar": false,
                        "positionClass": "toast-top-right",
                        "preventDuplicates": false,
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "5000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    };

                    toastr.success(result.msg);
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                } else {
                    toastr.options = {
                        "closeButton": false,
                        "debug": false,
                        "newestOnTop": false,
                        "progressBar": false,
                        "positionClass": "toast-top-right",
                        "preventDuplicates": false,
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "5000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    };

                    toastr.error(result.msg);
                }
            }
        });
    });

    $('button.giveMultipleRolePermission').on('click', function (event) {
        var role_id = $('input[name="role_id"]').val();
        var permissions = [];
        $('input[name="permission"]:checked').each(function(){
            permissions.push($(this).val());
        });
        $.ajax({
            url: location.origin+'/give-permission-role-multiple',
            type: "GET",
            data: {
                role_id: role_id,
                permissions: permissions
            },
            dataType: "json",
            success: function (result) {
                if (result.status == 1) {
                    toastr.options = {
                        "closeButton": false,
                        "debug": false,
                        "newestOnTop": false,
                        "progressBar": false,
                        "positionClass": "toast-top-right",
                        "preventDuplicates": false,
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "5000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    };

                    toastr.success(result.msg);
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                } else {
                    toastr.options = {
                        "closeButton": false,
                        "debug": false,
                        "newestOnTop": false,
                        "progressBar": false,
                        "positionClass": "toast-top-right",
                        "preventDuplicates": false,
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "5000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    };

                    toastr.error(result.msg);
                }
            }
        });
    });

    $('button.takeMultipleRolePermission').on('click', function (event) {
        var role_id = $('input[name="role_id"]').val();
        var permissions = [];
        $('input[name="permission"]:checked').each(function(){
            permissions.push($(this).val());
        });
        $.ajax({
            url: location.origin+'/take-permission-role-multiple',
            type: "GET",
            data: {
                role_id: role_id,
                permissions: permissions
            },
            dataType: "json",
            success: function (result) {
                if (result.status == 1) {
                    toastr.options = {
                        "closeButton": false,
                        "debug": false,
                        "newestOnTop": false,
                        "progressBar": false,
                        "positionClass": "toast-top-right",
                        "preventDuplicates": false,
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "5000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    };

                    toastr.success(result.msg);
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                } else {
                    toastr.options = {
                        "closeButton": false,
                        "debug": false,
                        "newestOnTop": false,
                        "progressBar": false,
                        "positionClass": "toast-top-right",
                        "preventDuplicates": false,
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "5000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    };

                    toastr.error(result.msg);
                }
            }
        });
    });

    $('button.deleteSelectedCustomers').on('click', function(){
        var ids = [];
        $('input[name="customer_id"]:checked').each(function(){
            ids.push($(this).val());
        });
        if( ids.length > 0 ){
            Swal.fire({
                title: 'Emin misiniz?',
                text: "Seçilen müşterileri kalıcı olarak silmek istiyorsunuz. Bu müşterilerin tüm verileri kalıcı olarak silinecektir. İşlemi onaylıyor musunuz?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Evet! Onaylıyorum',
                cancelButtonText: "Vazgeç",
            }).then(function (result) {
                if (result.value) {
                    $.ajax({
                        url:location.origin+'/delete-selected-customers',
                        method:'POST',
                        data:{
                            ids:ids
                        },
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        dataType:'json',
                        success: function (result) {
                            if (result.status == 1) {
                                Swal.fire(
                                    'İşlem Tamamlandı!',
                                    result.msg,
                                    'success'
                                ).then(function (result) {
                                    if (result.value) {
                                        window.location.reload();
                                    }
                                });
                            } else {
                                Swal.fire('Hata!', result.msg, 'error');
                            }
                        }
                    });

                }
            });
        }

    });

    $('button.deleteSelectedCalls').on('click', function(){
        var ids = [];
        $('input[name="call_id"]:checked').each(function(){
            ids.push($(this).val());
        });
        if( ids.length > 0 ){
            Swal.fire({
                title: 'Emin misiniz?',
                text: "Seçilen arama kayıtları kalıcı olarak silmek istiyorsunuz. Bu işlemi onaylıyor musunuz?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Evet! Onaylıyorum',
                cancelButtonText: "Vazgeç",
            }).then(function (result) {
                if (result.value) {
                    $.ajax({
                        url:location.origin+'/delete-selected-calls',
                        method:'POST',
                        data:{
                            ids:ids
                        },
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        dataType:'json',
                        success: function (result) {
                            if (result.status == 1) {
                                Swal.fire(
                                    'İşlem Tamamlandı!',
                                    result.msg,
                                    'success'
                                ).then(function (result) {
                                    if (result.value) {
                                        window.location.reload();
                                    }
                                });
                            } else {
                                Swal.fire('Hata!', result.msg, 'error');
                            }
                        }
                    });

                }
            });
        }

    });

    $('button.deleteSelectedReminders').on('click', function(){
        var ids = [];
        $('input[name="reminder_id"]:checked').each(function(){
            ids.push($(this).val());
        });
        if( ids.length > 0 ){
            Swal.fire({
                title: 'Emin misiniz?',
                text: "Seçilen hatırlatma kayıtları kalıcı olarak silmek istiyorsunuz. Bu işlemi onaylıyor musunuz?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Evet! Onaylıyorum',
                cancelButtonText: "Vazgeç",
            }).then(function (result) {
                if (result.value) {
                    $.ajax({
                        url:location.origin+'/delete-selected-reminders',
                        method:'POST',
                        data:{
                            ids:ids
                        },
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        dataType:'json',
                        success: function (result) {
                            if (result.status == 1) {
                                Swal.fire(
                                    'İşlem Tamamlandı!',
                                    result.msg,
                                    'success'
                                ).then(function (result) {
                                    if (result.value) {
                                        window.location.reload();
                                    }
                                });
                            } else {
                                Swal.fire('Hata!', result.msg, 'error');
                            }
                        }
                    });

                }
            });
        }

    });

    $('button.deleteSelectedAppointments').on('click', function(){
        var ids = [];
        $('input[name="appointment_id"]:checked').each(function(){
            ids.push($(this).val());
        });
        if( ids.length > 0 ){
            Swal.fire({
                title: 'Emin misiniz?',
                text: "Seçilen randevu kayıtları kalıcı olarak silmek istiyorsunuz. Bu işlemi onaylıyor musunuz?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Evet! Onaylıyorum',
                cancelButtonText: "Vazgeç",
            }).then(function (result) {
                if (result.value) {
                    $.ajax({
                        url:location.origin+'/delete-selected-appointments',
                        method:'POST',
                        data:{
                            ids:ids
                        },
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        dataType:'json',
                        success: function (result) {
                            if (result.status == 1) {
                                Swal.fire(
                                    'İşlem Tamamlandı!',
                                    result.msg,
                                    'success'
                                ).then(function (result) {
                                    if (result.value) {
                                        window.location.reload();
                                    }
                                });
                            } else {
                                Swal.fire('Hata!', result.msg, 'error');
                            }
                        }
                    });

                }
            });
        }

    });

    $('.openBidSendModal').on('click', function(){
        var id = $(this).attr('data-id');
        $('input[name="via_email"]').val("");
        $('input[name="via_title"]').val("");
        $('textarea[name="body"]').val("");
        $.ajax({
            url:location.origin+'/bid-detail/'+id,
            method:'GET',
            dataType:'json',
            success:function(response){
                if( response.status == 1 ){
                    $('.bid_no_text').text('#'+response.detail.bid_id+' Teklifini E-posta ile Gönder');
                    $('input[name="via_email"]').val(response.detail.email);
                    $('input[name="via_title"]').val(response.detail.title);
                    $('textarea[name="body"]').val(response.detail.body);
                    $('input[name="via_bid_id"]').val(response.detail.bid_id);
                    $('#sendBidModal').modal('show');
                }
            }
        });
    });

    $('.sendBid').on('click', function(){
        var bid = $('input[name="via_bid_id"]').val();
        var el = $(this);
        el.addClass('spinner spinner-white spinner-right');
        $.ajax({
            url:location.origin+'/send-bid-via-email/'+bid,
            method:'POST',
            dataType:'json',
            data:{
                email:$('input[name="via_email"]').val(),
                title:$('input[name="via_title"]').val(),
                body:$('textarea[name="body"]').val()
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success:function(result){
                if(result.status == 1){
                    el.removeClass('spinner spinner-white spinner-right');
                    $('#sendBidModal .modal-body').append('<div class="alert alert-success" role="alert">'+result.msg+'</div>');
                }else{
                    $('#sendBidModal .modal-body').append('<div class="alert alert-danger" role="alert">'+result.msg+'</div>');
                }
            }
        });
    });
    select2Refence();
    validateBids();
    toushcSping();
    placeTouchSpin(parseInt($('#place_count').attr('min')),parseInt($('#place_count').attr('max')));
    $('form#contractForm').validate();
    $('#place_count').on('touchspin.on.startupspin', function () {
        getRenderedPlaces();
    });
    $('#place_count').on('touchspin.on.startdownspin', function () {
        var val = $('#place_count').val();
        var r = parseInt(val) + 1;
        $('.placeRender[data-render="'+r+'"]').remove();
    });

    $('a.viewBid').on('click', function(){
        $('#bidViewModal .modal-body').html("");
        var bid_id = $(this).attr('data-id');
        $.ajax({
            url:location.origin+'/bids/view/'+bid_id,
            method:'GET',
            dataType:'json',
            success:function (response) {
                if(response.status == 1){
                    $('#bidViewModal #bidViewModalLabel').text(response.title);
                    $('#bidViewModal .modal-body').html(response.render);
                    $('#bidViewModal .sendBidviaMailButton').attr('data-id', response.id);
                    $('#bidViewModal').modal('show');
                }
            }
        });
    });

    $('.sendBidviaMailButton').on('click', function(){
        var id = $(this).attr('data-id');
        $('input[name="via_email"]').val("");
        $('input[name="via_title"]').val("");
        $('textarea[name="body"]').val("");
        $.ajax({
            url:location.origin+'/bid-detail/'+id,
            method:'GET',
            dataType:'json',
            success:function(response){
                if( response.status == 1 ){
                    $('.bid_no_text').text('#'+response.detail.bid_id+' Teklifini E-posta ile Gönder');
                    $('input[name="via_email"]').val(response.detail.email);
                    $('input[name="via_title"]').val(response.detail.title);
                    $('textarea[name="body"]').val(response.detail.body);
                    $('input[name="via_bid_id"]').val(response.detail.bid_id);
                    $('#bidViewModal').modal('hide');
                    $('#sendBidModal').modal('show');
                }
            }
        });
    });

    $("#sendBidModal").on("hidden.bs.modal", function () {
        $('#bidViewModal').modal('show');
    });

});

var placeTouchSpin = function(min,max){
    $('#place_count').TouchSpin({
        buttondown_class: 'btn btn-secondary',
        buttonup_class: 'btn btn-secondary',
        min: min,
        max: max
    });
}

var getRenderedPlaces = function(){
    var val = $('#place_count').val();
    if( val > 0 ){
        $.ajax({
            url:location.origin+'/render-places',
            method:'GET',
            data:{
                place_count:val
            },
            dataType:'json',
            success:function(response){
                if(response.status == 1){
                    $('.dependsPlaceCount').append(response.render);
                    $('.dependsPlaceCount').removeClass('d-none');
                    toushcSping();
                    validateBids();
                }
            }
        });
    }else{
        $('.dependsPlaceCount').addClass('d-none');
        $('.dependsPlaceCount').html("");
    }
}

var toushcSping = function(){
    $('.tspin').TouchSpin({
        buttondown_class: 'btn btn-secondary',
        buttonup_class: 'btn btn-secondary',
        min: 0,
        max: 30
    });
}

var validateBids = function(){
    $('form#bidForm').validate();
}

var select2Refence = function(){
    $('select[name="giver_reference"], select[name="customer_id"]').select2({
        minimumInputLength: 3,
        minimumResultsForSearch: 10,
        language:'tr',
        cache: true,
        allowClear: true,
        placeholder: "Lütfen en az 3 karakter giriniz.",
        ajax: {
            url: location.origin + '/customers/get-all-customers',
            dataType: 'json',
            data: function (term) {
                return {
                    term: term
                };
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        return {
                            text: item.first_name+' '+item.last_name,
                            id: item.customer_id
                        }
                    })
                };
            }
        }
    });
    $('select[name="customer_id"]').on('select2:selecting', function(e){
        var customer_id = $('select[name="customer_id"]').val();
        if( $('.customerAddress').length > 0 ){
            $('.customerAddress').html("");
            setTimeout(function(){
                $.ajax({
                    url:location.origin+'/get-customer-address',
                    method:'GET',
                    data:{
                        customer_id:$('select[name="customer_id"]').val()
                    },
                    dataType:'json',
                    success:function(response){
                        if(response.status == 1){
                            $('.customerAddress').html(response.temp);
                        }
                    }
                });
            },200);
        }
    });
}

var KTAddUser = function () {
    // Private Variables
    var _wizardEl;
    var _formEl;
    var _wizardObj;
    var _avatar;
    var _validations = [];

    // Private Functions
    var _initWizard = function () {
        // Initialize form wizard
        _wizardObj = new KTWizard(_wizardEl, {
            startStep: 1, // initial active step number
            clickableSteps: false  // allow step clicking
        });

        // Validation before going to next page
        _wizardObj.on('change', function (wizard) {
            if (wizard.getStep() > wizard.getNewStep()) {
                return; // Skip if stepped back
            }

            // Validate form before change wizard step
            var validator = _validations[wizard.getStep() - 1]; // get validator for currnt step

            if (validator) {
                validator.validate().then(function (status) {
                    if (status == 'Valid') {
                        wizard.goTo(wizard.getNewStep());

                        KTUtil.scrollTop();
                    } else {
                        Swal.fire({
                            text: "Üzgünüz, bazı hatalar tespit edildi. Lütfen tekrar deneyiniz.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Tamam, Anladım!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light"
                            }
                        }).then(function () {
                            KTUtil.scrollTop();
                        });
                    }
                });
            }

            return false;  // Do not change wizard step, further action will be handled by he validator
        });

        // Change event
        _wizardObj.on('changed', function (wizard) {
            KTUtil.scrollTop();
        });

        // Submit event
        _wizardObj.on('submit', function (wizard) {

        });
    }

    var _initValidations = function () {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/

        // Validation Rules For Step 1
        _validations.push(FormValidation.formValidation(
            _formEl,
            {
                fields: {
                    firstname: {
                        validators: {
                            notEmpty: {
                                message: 'İsim alanı gereklidir.'
                            },
                        }
                    },
                    lastname: {
                        validators: {
                            notEmpty: {
                                message: 'Soyisim alanı gereklidir.'
                            }
                        }
                    },
                    password: {
                        validators: {
                            notEmpty: {
                                message: 'Şifre alanı zorunludur'
                            },
                            stringLength: {
                                min: 8,
                                message: 'Şifre alanı en az 8 haneli olmalıdır'
                            },
                        }
                    },
                    password_confirm: {
                        validators: {
                            identical: {
                                compare: function () {
                                    return _formEl.querySelector('[name="password"]').value;
                                },
                                message: 'Şifre alanları eşleşmemektedir.'
                            }
                        }
                    },

                    email: {
                        validators: {
                            notEmpty: {
                                message: 'E-posta alanı gereklidir'
                            },
                            emailAddress: {
                                message: 'Lütfen geçerli bir e-posta adresi giriniz.'
                            },
                            remote: {
                                message: 'Bu e-posta adresi zaten kullanılıyor.',
                                method: 'GET',
                                url: Adminurl + "/check-user-email"
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    // Bootstrap Framework Integration
                    bootstrap: new FormValidation.plugins.Bootstrap({
                        //eleInvalidClass: '',
                        eleValidClass: '',
                    })
                }
            }
        ));

        _validations.push(FormValidation.formValidation(
            _formEl,
            {
                fields: {
                    phone: {
                        validators: {
                            notEmpty: {
                                message: 'Telefon alanı gereklidir'
                            },
                            phone: {
                                country: 'TR',
                                message: 'Lütfen geçerli bir telefon numarası giriniz. (ör: 5554443333)'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    // Bootstrap Framework Integration
                    bootstrap: new FormValidation.plugins.Bootstrap({
                        //eleInvalidClass: '',
                        eleValidClass: '',
                    })
                }
            }
        ));

        _validations.push(FormValidation.formValidation(
            _formEl,
            {
                fields: {
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    // Bootstrap Framework Integration
                    bootstrap: new FormValidation.plugins.Bootstrap({
                        //eleInvalidClass: '',
                        eleValidClass: '',
                    })
                }
            }
        ));
    }

    var _initAvatar = function () {
        _avatar = new KTImageInput('kt_user_add_avatar');
    }

    var _initSubmit = function () {
        var btn = $('form#kt_form').find('[data-wizard-type="action-submit"]');

        btn.on('click', function (e) {
            e.preventDefault();
            var formData = $('form#kt_form').serialize();
            $.ajax({
                url: Adminurl + "/add-new-user",
                method: "POST",
                data: formData,
                success: function (data) {
                    if (data.status == 1) {
                        Swal.fire(
                            'İşlem Tamamlandı!',
                            data.msg,
                            'success'
                        ).then(function (result) {
                            if (result.value) {
                                window.location.href = Adminurl + "/users";
                            }
                        });
                    } else {
                        Swal.fire('Hata!', data.msg, 'warning');
                    }

                }
            });
        });
    }

    return {
        // public functions
        init: function () {
            _wizardEl = KTUtil.getById('kt_wizard');
            _formEl = KTUtil.getById('kt_form');

            _initWizard();
            _initValidations();
            _initAvatar();
            _initSubmit();
        }
    };
}();

jQuery(document).ready(function () {
    if ($('#kt_wizard').length > 0) {
        KTAddUser.init();
    }

    var arrows;
    if (KTUtil.isRTL()) {
        arrows = {
            leftArrow: '<i class="la la-angle-right"></i>',
            rightArrow: '<i class="la la-angle-left"></i>'
        }
    } else {
        arrows = {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    }
    !function (a) {
        a.fn.datepicker.dates.tr = {days: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"], daysShort: ["Pz", "Pzt", "Sal", "Çrş", "Prş", "Cu", "Cts"], daysMin: ["Pz", "Pzt", "Sa", "Çr", "Pr", "Cu", "Ct"], months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"], monthsShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"], today: "Bugün", clear: "Temizle", weekStart: 1, format: "yyyy-mm-dd"}
    }(jQuery);

    $('input[name="birthday"]').datepicker({
        rtl: KTUtil.isRTL(),
        todayHighlight: true,
        orientation: "bottom left",
        templates: arrows,
        language: 'tr',
        format: 'yyyy-mm-dd'
    });

    $('input[name="phone"],input[name="ac_phone"], input[name="land_phone"], input[name="phone_2"]').mask('000 000 0000');
    $('.datepicker').datepicker({
        todayHighlight: true,
        orientation: "bottom left",
        templates: arrows,
        format:"yyyy-mm-dd",
        endDate: '+0d',
        autoclose: true,
        language:"tr"
    });
    $('#datetimepicker').datetimepicker({
        todayHighlight: true,
        format:"YYYY-MM-DD HH:mm",
        endDate: '+0d',
        locale:"tr"
    });
    var date = new Date();
    date.setDate(date.getDate()-1);
    $('.reminder-datepicker').datepicker({
        todayHighlight: true,
        orientation: "bottom left",
        templates: arrows,
        format:"yyyy-mm-dd",
        startDate: date,
        autoclose: true,
        language:"tr"
    });
    $('.reminder-timepicker').timepicker({
        minuteStep: 1,
        showSeconds: false,
        showMeridian: false,
        snapToStep: true,
        defaultTime:""
    });

    $('.editable').dblclick(function(){
        $(this).attr('contenteditable', true);
        $(this).focus();
        var key = $(this).attr('data-key');
        contentEditable($(this), key);
    });
    $('[data-toggle="tooltip"]').tooltip();
});

var contentEditable = function(el, key){
    el.focus(function() {
        el.data("initialText", el.html());
    })
        .blur(function() {
            if (el.data("initialText") !== el.html()) {
                var text = el.html();
                var id = el.closest('tr').attr('data-id');
                var action = el.closest('table').attr('data-action');
                $.ajax({
                    url:location.origin+'/edit-content',
                    method:"POST",
                    data:{
                        id:id,
                        key:key,
                        action:action,
                        value:text
                    },
                    dataType:"json",
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    success:function(response){
                        if(response.status == 1){
                            triggerToastrSuccess(response.msg);
                        }
                    }
                });
            }
        })
        .focusout(function(){
            el.attr('contenteditable', false);
        });
}
var triggerToastrSuccess = function(msg){
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    toastr.success(msg);
}

//Otomatik kopyalama

var KTClipboardDemo = function () {

    // Private functions
    var demos = function () {
        // basic example
        new ClipboardJS('[data-clipboard=true]').on('success', function(e) {
            e.clearSelection();
            alert('Kopyalandı!');
        });
    }

    return {
        // public functions
        init: function() {
            demos();
        }
    };
}();

jQuery(document).ready(function() {
    KTClipboardDemo.init();
});

//Tur Ekleme Validation
FormValidation.formValidation(
    document.getElementById('kt_form_1'),
    {
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: 'Tur Alanı Zorunludur'
                    },
                    emailAddress: {
                        message: 'Lütfen geçerli bir mail adresi giriniz'
                    }
                }
            },
            tour_type: {
                validators: {
                    notEmpty: {
                        message: 'Lütfen tur tipini seçiniz.'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'Şifre alanı zorunludur'
                    },
                    stringLength: {
                        min: 8,
                        message: 'Şifre alanı en az 8 haneli olmalıdır'
                    },
                }
            },
            password_confirm: {
                validators: {
                    identical: {
                        compare: function () {
                            return _formEl.querySelector('[name="password"]').value;
                        },
                        message: 'Şifre alanları eşleşmemektedir.'
                    }
                }
            },
            acente: {
                validators: {
                    notEmpty: {
                        message: 'Lütfen acente seçiniz.'
                    }
                }
            },
        },

        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            // Bootstrap Framework Integration
            bootstrap: new FormValidation.plugins.Bootstrap(),
            // Validate fields when clicking the Submit button
            submitButton: new FormValidation.plugins.SubmitButton(),
            // Submit the form when all fields are valid
            defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
        }
    }
);

FormValidation.formValidation(
    document.getElementById('kt_form_2'),
    {
        fields: {
            acente_name: {
                validators: {
                    notEmpty: {
                        message: 'Acente Adı Alanı Zorunludur'
                    },
                    emailAddress: {
                        message: 'Lütfen geçerli bir mail adresi giriniz'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'Şifre alanı zorunludur'
                    },
                    stringLength: {
                        min: 8,
                        message: 'Şifre alanı en az 8 haneli olmalıdır'
                    },
                }
            },
            password_confirm: {
                validators: {
                    identical: {
                        compare: function () {
                            return form.querySelector('[name="password"]').value;
                        },
                        message: 'Şifre alanları eşleşmemektedir.'
                    }
                }
            },
        },

        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            // Bootstrap Framework Integration
            bootstrap: new FormValidation.plugins.Bootstrap(),
            // Validate fields when clicking the Submit button
            submitButton: new FormValidation.plugins.SubmitButton(),
            // Submit the form when all fields are valid
            defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
        }
    }
);

