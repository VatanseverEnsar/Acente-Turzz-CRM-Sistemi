var SummernoteDemo={
	init:function(){
		$(".summernote").summernote({
			height:450,
			callbacks: {
				onImageUpload: function(image) {
					uploadImage(image[0]);
				}
			}
			}
		)
	}
};
jQuery(document).ready(function(){
	SummernoteDemo.init();
});
function uploadImage(image) {
    var data = new FormData();
    data.append("image", image);
    $.ajax({
        url: '../files/do_upload',
        cache: false,
        contentType: false,
        processData: false,
        data: data,
        type: "post",
        success: function(url) {
            var image = $('<img>').attr('src', url);
            $('.summernote').summernote("insertNode", image[0]);
        },
        error: function(data) {
            console.log(data);
        }
    });
}