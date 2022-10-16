var DatatablesDataSourceHtml= {
    init:function() {
        $("#m_table_1").DataTable( {
            responsive:!0,
			"order": [[ 0, "desc" ]],
			"dom": 'Bfrtip',
			"buttons": [
				'excel', 'pdf', 'print'
			],
			"language": {
				"decimal":        "",
				"emptyTable":     "Herhangi bir veri bulunamadı",
				"info":           "Toplam _TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor.",
				"infoEmpty":      "Toplam 0 entries 0 ile 0 arası kayıt gösteriliyor",
				"infoFiltered":   "(filtered from _MAX_ total entries)",
				"infoPostFix":    "",
				"thousands":      ",",
				"lengthMenu":     "_MENU_ kayıt gösteriliyor.",
				"loadingRecords": "Yükleniyor...",
				"processing":     "İşleminiz yapılıyor...",
				"search":         "Arama:",
				"zeroRecords":    "Herhangi bir veri bulunamadı",
				"paginate": {
					"first":      "İlk",
					"last":       "Son",
				},
				"aria": {
					"sortAscending":  ": activate to sort column ascending",
					"sortDescending": ": activate to sort column descending"
				}
			},
        }
        )
    }
}

;
jQuery(document).ready(function() {
    DatatablesDataSourceHtml.init()
}

);