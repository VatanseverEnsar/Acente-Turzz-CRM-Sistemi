var BootstrapDatepicker=function() {
    var t;
    t=mUtil.isRTL()? {
        leftArrow: '<i class="la la-angle-right"></i>', rightArrow: '<i class="la la-angle-left"></i>'
    }
    : {
        leftArrow: '<i class="la la-angle-left"></i>', rightArrow: '<i class="la la-angle-right"></i>'
    }
    ;
    return {
        init:function() {
            $("#m_datepicker_1, #m_datepicker_1_validate, #m_datepicker_2").datepicker( {
                rtl: mUtil.isRTL(), 
				todayHighlight: !0, 
				orientation: "bottom left", 
				templates: t,
				language: 'tr',
				format: "dd.mm.yyyy",
				autoclose:true,
				startDate: new Date() 
            }
            ),
            $("#m_datepicker_1_modal").datepicker( {
                rtl: mUtil.isRTL(), todayHighlight: !0, orientation: "bottom left", templates: t
            }
            ),
            $("#m_datepicker_2, #m_datepicker_2_validate").datepicker( {
                rtl: mUtil.isRTL(), todayHighlight: !0, orientation: "bottom left", templates: t
            }
            ),
            $("#m_datepicker_2_modal").datepicker( {
                rtl: mUtil.isRTL(), todayHighlight: !0, orientation: "bottom left", templates: t
            }
            ),
            $("#m_datepicker_3, #m_datepicker_3_validate").datepicker( {
                rtl: mUtil.isRTL(), todayBtn: "linked", clearBtn: !0, todayHighlight: !0, templates: t
            }
            ),
            $("#m_datepicker_3_modal").datepicker( {
                rtl: mUtil.isRTL(), todayBtn: "linked", clearBtn: !0, todayHighlight: !0, templates: t
            }
            ),
            $("#m_datepicker_4_1").datepicker( {
                rtl: mUtil.isRTL(), orientation: "top left", todayHighlight: !0, templates: t
            }
            ),
            $("#m_datepicker_4_2").datepicker( {
                rtl: mUtil.isRTL(), orientation: "top right", todayHighlight: !0, templates: t
            }
            ),
            $("#m_datepicker_4_3").datepicker( {
                rtl: mUtil.isRTL(), orientation: "bottom left", todayHighlight: !0, templates: t
            }
            ),
            $("#m_datepicker_4_4").datepicker( {
                rtl: mUtil.isRTL(), orientation: "bottom right", todayHighlight: !0, templates: t
            }
            ),
            $("#m_datepicker_5").datepicker( {
                rtl: mUtil.isRTL(), todayHighlight: !0, templates: t
            }
            ),
            $("#m_datepicker_6").datepicker( {
                rtl: mUtil.isRTL(), todayHighlight: !0, templates: t
            }
            )
        }
    }
}

();
;(function($){
	$.fn.datepicker.dates['tr'] = {
		days: ["Pazar", "Pazartesi", "Sal??", "??ar??amba", "Per??embe", "Cuma", "Cumartesi"],
		daysShort: ["Pz", "Pzt", "Sal", "??r??", "Pr??", "Cu", "Cts"],
		daysMin: ["Pz", "Pzt", "Sa", "??r", "Pr", "Cu", "Ct"],
		months: ["Ocak", "??ubat", "Mart", "Nisan", "May??s", "Haziran", "Temmuz", "A??ustos", "Eyl??l", "Ekim", "Kas??m", "Aral??k"],
		monthsShort: ["Oca", "??ub", "Mar", "Nis", "May", "Haz", "Tem", "A??u", "Eyl", "Eki", "Kas", "Ara"],
		today: "Bug??n",
		clear: "Temizle",
		weekStart: 1,
		format: "dd.mm.yyyy"
	};
}(jQuery));
jQuery(document).ready(function() {
    BootstrapDatepicker.init()
}

);