//== Class definition

var UserDataTable = function() {
  //== Private functions

  // basic demo
  var UserTable = function() {

    var datatable = $('#user_datatable').mDatatable({
      // datasource definition
      data: {
        type: 'remote',
        source: {
          read: {
            // sample GET method
            method: 'GET',
            url: 'get_all_users',
            map: function(raw) {
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
          field: 'RecordID',
          title: '#',
          sortable: false, // disable sort for this column
          width: 40,
          selector: {class: 'm-checkbox--solid m-checkbox--brand'},
          textAlign: 'center',
        }, {
          field: 'Resim',
          title: 'Resim',
          sortable: false, // disable sort for this column
          width: 60,
          textAlign: 'center',
		  template: function(row) {
			  if( row.profile_img == null ){
				  return "<img src='https://via.placeholder.com/100x100' class='profile_img' />";
			  }else{
				  return "<img src='"+location.origin+"/images/avatars/"+row.profile_img+"' class='profile_img' />";
			  }
          },
        },{
          field: 'name',
          title: 'Adı Soyadı',
          
          filterable: false, // disable or enable filtering
          width: 150,
          // basic templating support for column rendering,
          template: '{{name}}',
        }, {
          field: 'Email',
          title: 'E-Posta Adresi',
          width: 150,
          template: '{{email}}',
        }, {
          field: 'Status',
          title: 'Durum',
          // callback function support for column rendering
          template: function(row) {
            return '<span class="m-badge ' + ( row.email_verified_at == null ? "m-badge--brand" : "m-badge--success" ) + ' m-badge--wide">' + ( row.email_verified_at == null ? "Bekleyen" : "Onaylanmış" ) + '</span>';
          },
        }, {
          field: 'Role',
          title: 'Kullanıcı Rolü',
          // callback function support for column rendering
		  template: function (row) {
				var status = {
					1: {'title': 'Yönetici', 'state': 'danger'},
					2: {'title': 'Kullanıcı', 'state': 'primary'},
					3: {'title': 'Yardımcı Yönetici', 'state': 'warning'},
					4: {'title': 'Editör', 'state': 'accent'}
				};
				return '<span class="m-badge m-badge--' + status[row.role_id].state + ' m-badge--dot"></span>&nbsp;<span class="m--font-bold m--font-' + status[row.role_id].state + '">' + status[row.role_id].title + '</span>';
			}
        },{
          field: 'Phone',
          title: 'Telefon',
          // callback function support for column rendering
          template: function (row) { 
			return row.phone == null ? "Belirtilmemiş" : row.phone;
		  }
        },{
          field: 'City',
          title: 'Şehir',
          // callback function support for column rendering
          template: function (row) { 
			return row.CityName == null ? "Belirtilmemiş" : row.CityName;
		  }
        },{
          field: 'created_at',
          title: 'Kayıt Tarihi',
		  sortable: 'desc',
          // callback function support for column rendering
          template: function (row) { 
			var date = new Date(row.created_at);
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			var hours = date.getHours();
			var minutes = date.getMinutes();
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
			return day + " " + month + ", " + year + " "+hours+":"+minutes;
		  }
        }, {
          field: 'Actions',
          width: 110,
          title: 'İşlemler',
          sortable: false,
          overflow: 'visible',
          template: function (row, index, datatable) {
            var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
            return '\
						<div class="dropdown ' + dropup + '">\
							<a href="#" class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">\
                                <i class="la la-ellipsis-h"></i>\
                            </a>\
						  	<div class="dropdown-menu dropdown-menu-right">\
						    	<a class="dropdown-item" href="/admin/user-edit/'+row.id+'"><i class="la la-edit"></i> Kullanıcı Düzenle</a>\
						    	<a class="dropdown-item" href="#"><i class="la la-trash"></i> Kullanıcı Sil</a>\
						    	<a class="dropdown-item" href="#"><i class="la la-print"></i> Yazdır</a>\
						  	</div>\
						</div>\
						<a href="/admin/user-edit/'+row.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Kullanıcı Düzenle">\
							<i class="la la-edit"></i>\
						</a>\
						<a href="/admin/del/'+row.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Sil">\
							<i class="la la-trash"></i>\
						</a>\
					';
          },
        }],
    });

    var query = datatable.getDataSourceQuery();

    $('#m_form_status').on('change', function() {
      datatable.search($(this).val().toLowerCase(), 'Status');
    });

    $('#m_form_type').on('change', function() {
      datatable.search($(this).val().toLowerCase(), 'Type');
    });

    $('#m_form_status, #m_form_type').selectpicker();

  };

  return {
    // public functions
    init: function() {
      UserTable();
    },
  };
}();



jQuery(document).ready(function() {
  UserDataTable.init();

});